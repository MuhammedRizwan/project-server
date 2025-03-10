import { EmailService, GenerateOtp, JwtService, PasswordService } from "../../../domain/entities/services/service";
import { OTPRepository } from "../../../domain/entities/OTP/otp";
import { UserRepository } from "../../../domain/entities/user/user";
import { CustomError } from "../../../domain/errors/customError";
import { WalletRepository } from "../../../domain/entities/wallet/wallet";
import { Dependencies } from "../../../domain/entities/depencies/depencies";
import HttpStatusCode from "../../../domain/enum/httpstatus";

export class Verification {
  private _jwtService: JwtService;
  private _OTPRepository: OTPRepository;
  private _userRepository: UserRepository;
  private _walletRepository:WalletRepository
  private _generateOtp: GenerateOtp;
  private _emailService: EmailService;
  private _passwordService: PasswordService;

  constructor(dependencies: Dependencies) {
    this._jwtService = dependencies.Services.JwtService;
    this._OTPRepository = dependencies.Repositories.OTPRepository;
    this._userRepository = dependencies.Repositories.UserRepository;
    this._walletRepository=dependencies.Repositories.WalletRepository
    this._generateOtp = dependencies.Services.GenerateOtp;
    this._emailService = dependencies.Services.EmailService;
    this._passwordService = dependencies.Services.PasswordService;
  }

  async refreshAccessToken(token: string): Promise<string> {
    try {
      const incommingRefreshToken = token;
      if (!incommingRefreshToken) {
        throw new CustomError("Invalid refresh token", HttpStatusCode.UNAUTHORIZED);
      }
      const decoded = this._jwtService.verifyRefreshToken(incommingRefreshToken);
      if (!decoded) {
        throw new CustomError("Invalid refresh token", HttpStatusCode.UNAUTHORIZED);
      }
      const user = await this._userRepository.getUser(decoded.userId);
      if (!user) {
        throw new CustomError("Invalid refresh token", HttpStatusCode.UNAUTHORIZED);
      }
      if (incommingRefreshToken !== user?.refreshToken) {
        throw new CustomError("Invalid refresh token", HttpStatusCode.UNAUTHORIZED);
      }
      const accessToken = this._jwtService.generateAccessToken(user?._id);
      if (!accessToken) {
        throw new CustomError("token Error", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }      
      return accessToken;
    } catch (err) {
      throw new Error("Invalid refresh token");
    }
  }

  async OTPVerification(Otp: string, email: string) {
    try {
      const OTP = await this._OTPRepository.findOTPbyEmail(email);      
      if (!OTP) {
        throw new CustomError("OTP expired", HttpStatusCode.GONE);
      }
      if (OTP.otp !== Otp) {
        throw new CustomError("Incorrect OTP", HttpStatusCode.BAD_REQUEST);
      }
      const userData = await this._userRepository.verifyuser(email);
      if (!userData) {
        throw new CustomError("User not verified", HttpStatusCode.BAD_REQUEST);
      }
      const accessToken = this._jwtService.generateAccessToken(userData._id);
      if (!accessToken) {
        throw new CustomError("Couldn't generate token", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      const refreshToken = this._jwtService.generateRefreshToken(userData._id);
      if (!refreshToken) {
        throw new CustomError("Couldn't generate token", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      await this._walletRepository.createWallet(userData._id)
      return { userData, accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }
  async sendOTP(email: string) {
    try {
      const existUser = await this._userRepository.findUserByEmail(email);
      if (!existUser) {
        throw new CustomError("user not exist", HttpStatusCode.CONFLICT);
      }
      const verificationOtp = this._generateOtp.generate();
      if (!verificationOtp) {
        throw new CustomError("Coudn't genarete OTP", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      await this._emailService.sendVerificationEmail(email, verificationOtp);
      const createOTP = await this._OTPRepository.createOTP({
        email: email,
        otp: verificationOtp,
      });
      if (!createOTP) {
        throw new CustomError("OTP creation failed", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      return createOTP;
    } catch (error) {
      throw error;
    }
  }
  async changePassword(email: string, password: string) {
    try {
      const isUser = await this._userRepository.findUserByEmail(email);
      if (!isUser) {
        throw new CustomError("Invalid user", HttpStatusCode.NOT_FOUND);
      }
      password = await this._passwordService.passwordHash(password);
      const updatePassword = this._userRepository.changePassword(
        email,
        password
      );
      if (!updatePassword) {
        throw new CustomError("password not updated", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      return updatePassword;
    } catch (error) {
      throw error
    }
  }
}
