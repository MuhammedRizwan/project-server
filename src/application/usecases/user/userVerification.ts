import { EmailService, GenerateOtp, JwtService, PasswordService } from "../../../domain/entities/services/service";
import { OTPRepository } from "../../../domain/entities/OTP/otp";
import { UserRepository } from "../../../domain/entities/user/user";
import { CustomError } from "../../../domain/errors/customError";
import { WalletRepository } from "../../../domain/entities/wallet/wallet";

interface Dependencies {
  services: {
    JwtService: JwtService;
    EmailService: EmailService;
    GenerateOtp: GenerateOtp;
    PasswordService: PasswordService;
  };
  Repositories: {
    OTPRepository: OTPRepository;
    UserRepository: UserRepository;
    WalletRepository:WalletRepository
  };
}

export class Verification {
  private jwtService: JwtService;
  private OTPRepository: OTPRepository;
  private userRepository: UserRepository;
  private walletRepository:WalletRepository
  private generateOtp: GenerateOtp;
  private emailService: EmailService;
  private passwordService: PasswordService;

  constructor(dependencies: Dependencies) {
    this.jwtService = dependencies.services.JwtService;
    this.OTPRepository = dependencies.Repositories.OTPRepository;
    this.userRepository = dependencies.Repositories.UserRepository;
    this.walletRepository=dependencies.Repositories.WalletRepository
    this.generateOtp = dependencies.services.GenerateOtp;
    this.emailService = dependencies.services.EmailService;
    this.passwordService = dependencies.services.PasswordService;
  }

  async refreshAccessToken(token: string): Promise<string> {
    try {
      const incommingRefreshToken = token;
      if (!incommingRefreshToken) {
        throw new CustomError("Invalid refresh token", 401);
      }
      const decoded = this.jwtService.verifyRefreshToken(incommingRefreshToken);
      if (!decoded) {
        throw new CustomError("Invalid refresh token", 401);
      }
      const user = await this.userRepository.getUser(decoded.userId);
      if (!user) {
        throw new CustomError("Invalid refresh token", 401);
      }
      if (incommingRefreshToken !== user?.refreshToken) {
        throw new CustomError("Invalid refresh token", 401);
      }
      const accessToken = this.jwtService.generateAccessToken(user?._id);
      if (!accessToken) {
        throw new CustomError("token Error", 500);
      }      
      return accessToken;
    } catch (err) {
      throw new Error("Invalid refresh token");
    }
  }

  async OTPVerification(Otp: string, email: string) {
    try {
      const OTP = await this.OTPRepository.findOTPbyEmail(email);      
      if (!OTP) {
        throw new CustomError("OTP expired", 410);
      }
      if (OTP.otp !== Otp) {
        throw new CustomError("Incorrect OTP", 400);
      }
      const userData = await this.userRepository.verifyuser(email);
      if (!userData) {
        throw new CustomError("User not verified", 400);
      }
      const accessToken = this.jwtService.generateAccessToken(userData._id);
      if (!accessToken) {
        throw new CustomError("Couldn't generate token", 500);
      }
      const refreshToken = this.jwtService.generateRefreshToken(userData._id);
      if (!refreshToken) {
        throw new CustomError("Couldn't generate token", 500);
      }
      await this.walletRepository.createWallet(userData._id)
      return { userData, accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }
  async sendOTP(email: string) {
    try {
      const existUser = await this.userRepository.findUserByEmail(email);
      if (!existUser) {
        throw new CustomError("user not exist", 409);
      }
      const verificationOtp = this.generateOtp.generate();
      if (!verificationOtp) {
        throw new CustomError("Coudn't genarete OTP", 500);
      }
      await this.emailService.sendVerificationEmail(email, verificationOtp);
      const createOTP = await this.OTPRepository.createOTP({
        email: email,
        otp: verificationOtp,
      });
      if (!createOTP) {
        throw new CustomError("OTP creation failed", 500);
      }
      return createOTP;
    } catch (error) {
      throw error;
    }
  }
  async changePassword(email: string, password: string) {
    try {
      const isUser = await this.userRepository.findUserByEmail(email);
      if (!isUser) {
        throw new CustomError("Invalid user", 404);
      }
      password = await this.passwordService.passwordHash(password);
      const updatePassword = this.userRepository.changePassword(
        email,
        password
      );
      if (!updatePassword) {
        throw new CustomError("password not updated", 500);
      }
      return updatePassword;
    } catch (error) {
      throw error
    }
  }
}
