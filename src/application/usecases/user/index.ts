import { Iuser, UserRepository } from "../../../domain/entities/user/user";
import { OTPRepository } from "../../../domain/entities/OTP/otp";
import { CustomError } from "../../../domain/errors/customError";
import { CloudinaryService, EmailService, GenerateOtp, JwtService, PasswordService } from "../../../domain/entities/services/service";
import { Dependencies } from "../../../domain/entities/depencies/depencies";
import HttpStatusCode from "../../../domain/enum/httpstatus";



export class UserUseCase {
  private _userRepository: UserRepository;
  private _OTPRepository: OTPRepository;
  private _emailService: EmailService;
  private _passwordService: PasswordService;
  private _generateOtp: GenerateOtp;
  private _JwtService: JwtService;
  private _CloudinaryService: CloudinaryService;

  constructor(dependencies: Dependencies) {
    this._userRepository = dependencies.Repositories.UserRepository;
    this._OTPRepository = dependencies.Repositories.OTPRepository;
    this._emailService = dependencies.Services.EmailService;
    this._passwordService = dependencies.Services.PasswordService;
    this._generateOtp = dependencies.Services.GenerateOtp;
    this._JwtService = dependencies.Services.JwtService;
    this._CloudinaryService = dependencies.Services.CloudinaryService;
  }
  async signupUser(userData: Iuser) {
    try {
      const existUser = await this._userRepository.findUserByEmail(
        userData.email
      );
      if (existUser) {
        throw new CustomError("user already exists", HttpStatusCode.CONFLICT);
      }
      userData.password = await this._passwordService.passwordHash(
        userData.password
      );
      const verificationOtp = this._generateOtp.generate();
      if (!verificationOtp) {
        throw new CustomError("couldn't genarate OTP", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      const createOTP = await this._OTPRepository.createOTP({
        email: userData.email,
        otp: verificationOtp,
      });
      if (!createOTP) {
        throw new CustomError("OTP creation failed", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      await this._emailService.sendVerificationEmail(
        userData.email,
        verificationOtp
      );
      const user = await this._userRepository.createUser(userData);
      if (!user) {
        throw new CustomError("something went wrong cannot signup user", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  async signinUser(email: string, password: string) {
    try {
      const user = await this._userRepository.findUserByEmail(email);
      if (!user) {
        throw new CustomError("Email Not Found", HttpStatusCode.NOT_FOUND);
      }
      const verifiedPassword = await this._passwordService.verifyPassword(
        password,
        user.password
      );
      if (!verifiedPassword) {
        throw new CustomError("Invalid password", HttpStatusCode.FORBIDDEN);
      }
      if (user.is_block) {
        throw new CustomError("user has been Blocked", HttpStatusCode.FORBIDDEN);
      }
      if (!user.is_verified) {
        const verificationOtp = this._generateOtp.generate();
        if (!verificationOtp) {
          throw new CustomError("coudn't generate OTP", HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        const createOTP = await this._OTPRepository.createOTP({
          email: user.email,
          otp: verificationOtp,
        });
        if (!createOTP) {
          throw new CustomError("OTP creation failed", HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
        await this._emailService.sendVerificationEmail(
          user.email,
          verificationOtp
        );
      }
      const accessToken = this._JwtService.generateAccessToken(user._id);
      if (!accessToken) {
        throw new CustomError("Couldn't generate token", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      const refreshToken = this._JwtService.generateRefreshToken(user._id);
      if (!refreshToken) {
        throw new CustomError("Couldn't generate token", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      await this._userRepository.updateRefreshToken(user._id, refreshToken);
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
      let user = await this._userRepository.findUserByEmail(googleUser.email);
      if (!user) {
        const userData = {
          username: googleUser.name,
          email: googleUser.email,
          password: googleUser.id,
          profile_pic: googleUser.picture,
          google_authenticated: true,
          is_verified: true,
        };
        user = await this._userRepository.createUser(userData);
        if (!user) {
          throw new CustomError("something went wrong cannot signup user", HttpStatusCode.INTERNAL_SERVER_ERROR);
        }
      }
      const accessToken = this._JwtService.generateAccessToken(user._id);
      if (!accessToken) {
        throw new CustomError("Couldn't generate token", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      const refreshToken = this._JwtService.generateRefreshToken(user._id);
      if (!refreshToken) {
        throw new CustomError("Couldn't generate token", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      return { user, accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }
  async getProfile(userId: string) {
    try {
      const user = await this._userRepository.getUser(userId);
      if (!user) {
        throw new CustomError("user not found", HttpStatusCode.NOT_FOUND);
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
        userData.profile_picture = await this._CloudinaryService.uploadImage(
          file
        );
      }
      const user = await this._userRepository.updateProfile(userId, userData);
      if (!user) {
        throw new CustomError("user not found", HttpStatusCode.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  async validatePassword(userId: string, password: string) {
    try {
      const user = await this._userRepository.getUser(userId);
      if (!user) {
        throw new CustomError("user not found", HttpStatusCode.NOT_FOUND);
      }
      const verifiedPassword = await this._passwordService.verifyPassword(
        password,
        user.password
      );
      if (!verifiedPassword) {
        throw new CustomError("Invalid password", HttpStatusCode.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  async updatePassword(userId: string, password: string) {
    try {
      const HashedPssword = await this._passwordService.passwordHash(password);
      if (!HashedPssword) {
        throw new CustomError("something went wrong", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      const user = await this._userRepository.updatePassword(
        userId,
        HashedPssword
      );
      if (!user) {
        throw new CustomError("user not found", HttpStatusCode.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
