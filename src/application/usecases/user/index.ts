import { Iuser, UserRepository } from "../../../domain/entities/user/user";
import { OTPRepository } from "../../../domain/entities/OTP/otp";
import { CustomError } from "../../../domain/errors/customError";
import { CloudinaryService, EmailService, GenerateOtp, JwtService, PasswordService } from "../../../domain/entities/services/service";


interface Dependencies {
  Repositories: {
    UserRepository: UserRepository;
    OTPRepository: OTPRepository;
  };
  services: {
    EmailService: EmailService;
    PasswordService: PasswordService;
    GenerateOtp: GenerateOtp;
    JwtService: JwtService;
    CloudinaryService: CloudinaryService;
  };
}
export class UserUseCase {
  private userRepository: UserRepository;
  private OTPRepository: OTPRepository;
  private emailService: EmailService;
  private passwordService: PasswordService;
  private generateOtp: GenerateOtp;
  private JwtService: JwtService;
  private CloudinaryService: CloudinaryService;

  constructor(dependencies: Dependencies) {
    this.userRepository = dependencies.Repositories.UserRepository;
    this.OTPRepository = dependencies.Repositories.OTPRepository;
    this.emailService = dependencies.services.EmailService;
    this.passwordService = dependencies.services.PasswordService;
    this.generateOtp = dependencies.services.GenerateOtp;
    this.JwtService = dependencies.services.JwtService;
    this.CloudinaryService = dependencies.services.CloudinaryService;
  }
  async signupUser(userData: Iuser) {
    try {
      const existUser = await this.userRepository.findUserByEmail(
        userData.email
      );
      if (existUser) {
        throw new CustomError("user already exists", 409);
      }
      userData.password = await this.passwordService.passwordHash(
        userData.password
      );
      const verificationOtp = this.generateOtp.generate();
      if (!verificationOtp) {
        throw new CustomError("couldn't genarate OTP", 500);
      }
      const createOTP = await this.OTPRepository.createOTP({
        email: userData.email,
        otp: verificationOtp,
      });
      if (!createOTP) {
        throw new CustomError("OTP creation failed", 500);
      }
      await this.emailService.sendVerificationEmail(
        userData.email,
        verificationOtp
      );
      const user = await this.userRepository.createUser(userData);
      if (!user) {
        throw new CustomError("something went wrong cannot signup user", 500);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  async signinUser(email: string, password: string) {
    try {
      const user = await this.userRepository.findUserByEmail(email);
      if (!user) {
        throw new CustomError("Email Not Found", 404);
      }
      const verifiedPassword = await this.passwordService.verifyPassword(
        password,
        user.password
      );
      if (!verifiedPassword) {
        throw new CustomError("Invalid password", 403);
      }
      if (user.is_block) {
        throw new CustomError("user has been Blocked", 403);
      }
      if (!user.is_verified) {
        const verificationOtp = this.generateOtp.generate();
        if (!verificationOtp) {
          throw new CustomError("coudn't generate OTP", 500);
        }
        const createOTP = await this.OTPRepository.createOTP({
          email: user.email,
          otp: verificationOtp,
        });
        if (!createOTP) {
          throw new CustomError("OTP creation failed", 500);
        }
        await this.emailService.sendVerificationEmail(
          user.email,
          verificationOtp
        );
      }
      const accessToken = this.JwtService.generateAccessToken(user._id);
      if (!accessToken) {
        throw new CustomError("Couldn't generate token", 500);
      }
      const refreshToken = this.JwtService.generateRefreshToken(user._id);
      if (!refreshToken) {
        throw new CustomError("Couldn't generate token", 500);
      }
      await this.userRepository.updateRefreshToken(user._id, refreshToken);
      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }
  async googleLogin(googleUser: any) {
    try {
      let user = await this.userRepository.findUserByEmail(googleUser.email);
      if (!user) {
        const userData = {
          username: googleUser.name,
          email: googleUser.email,
          password: googleUser.id,
          profile_pic: googleUser.picture,
          google_authenticated: true,
          is_verified: true,
        };
        user = await this.userRepository.createUser(userData);
        if (!user) {
          throw new CustomError("something went wrong cannot signup user", 500);
        }
      }
      const accessToken = this.JwtService.generateAccessToken(user._id);
      if (!accessToken) {
        throw new CustomError("Couldn't generate token", 500);
      }
      const refreshToken = this.JwtService.generateRefreshToken(user._id);
      if (!refreshToken) {
        throw new CustomError("Couldn't generate token", 500);
      }
      return { user, accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }
  async getProfile(userId: string) {
    try {
      const user = await this.userRepository.getUser(userId);
      if (!user) {
        throw new CustomError("user not found", 404);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  async updateProfile(
    userId: string,
    userData: Iuser,
    file: Express.Multer.File|undefined
  ) {
    try {
      if (file) {
        userData.profile_picture = await this.CloudinaryService.uploadImage(
          file
        );
      }
      const user = await this.userRepository.updateProfile(userId, userData);
      if (!user) {
        throw new CustomError("user not found", 404);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  async validatePassword(userId: string, password: string) {
    try {
      const user = await this.userRepository.getUser(userId);
      if (!user) {
        throw new CustomError("user not found", 404);
      }
      const verifiedPassword = await this.passwordService.verifyPassword(
        password,
        user.password
      );
      if (!verifiedPassword) {
        throw new CustomError("Invalid password", 404);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  async updatePassword(userId: string, password: string) {
    try {
      const HashedPssword = await this.passwordService.passwordHash(password);
      if (!HashedPssword) {
        throw new CustomError("something went wrong", 500);
      }
      const user = await this.userRepository.updatePassword(
        userId,
        HashedPssword
      );
      if (!user) {
        throw new CustomError("user not found", 404);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
