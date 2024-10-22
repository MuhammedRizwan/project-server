import { Iuser } from "../../../domain/entities/user/user";
import { IOTP } from "../../../domain/entities/user/otp";
import { CustomError } from "../../../domain/errors/customError";

interface UserRepository {
  createUser(user: Iuser): Promise<Iuser>;
  findUserByEmail(email: string): Promise<Iuser | null>;
  updateRefreshToken(id: string|undefined, refreshToken: string): Promise<void>;
}
interface OTPRepository {
  createOTP({ email, otp }: { email: string; otp: string }): Promise<IOTP>;
  findOTPbyEmail(email: string): Promise<IOTP | null>;
}
interface EmailService {
  sendVerificationEmail(email: string, otp: string): Promise<void>;
}
interface PasswordService {
  passwordHash(password: string): Promise<string>;
  verifyPassword(password: string, userPassword: string): Promise<boolean>;
}
interface GenerateOtp {
  generate(): string;
}
interface JwtService {
  generateAccessToken(userId: string | undefined): string;
  generateRefreshToken(userId: string | undefined): string;
}

interface Dependencies {
  Repositories: {
    MongoUserRepository: UserRepository;
    MongoOTPRepository: OTPRepository;
  };
  services: {
    EmailService: EmailService;
    PasswordService: PasswordService;
    GenerateOtp: GenerateOtp;
    JwtService: JwtService;
  };
}
export class UserUseCase {
  private userRepository: UserRepository;
  private OTPRepository: OTPRepository;
  private emailService: EmailService;
  private passwordService: PasswordService;
  private generateOtp: GenerateOtp;
  private JwtService: JwtService;

  constructor(dependencies: Dependencies) {
    this.userRepository = dependencies.Repositories.MongoUserRepository;
    this.OTPRepository = dependencies.Repositories.MongoOTPRepository;
    this.emailService = dependencies.services.EmailService;
    this.passwordService = dependencies.services.PasswordService;
    this.generateOtp = dependencies.services.GenerateOtp;
    this.JwtService = dependencies.services.JwtService;
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
        throw new CustomError("Invalid password", 401);
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
      if(!accessToken){
        throw new CustomError("Couldn't generate token",500)
      }
      const refreshToken = this.JwtService.generateRefreshToken(user._id);
      if(!refreshToken){
        throw new CustomError("Couldn't generate token",500)
      }
      await this.userRepository.updateRefreshToken(user._id, refreshToken);
      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      throw error;
    }
  }
  async googleLogin(googleUser: any) {
    try {
      const user = await this.userRepository.findUserByEmail(googleUser.email);
      if (!user) {
        const userData = {
          username: googleUser.name,
          email: googleUser.email,
          password: googleUser.id,
          profile_pic: googleUser.picture,
          is_verified: true,
        };
        const newUser = await this.userRepository.createUser(userData);
        if (!newUser) {
          throw new CustomError("something went wrong cannot signup user", 500);
        }
        return newUser;
      } else {
        const accessToken = this.JwtService.generateAccessToken(user._id);
        if (!accessToken) {
          throw new CustomError("Couldn't generate token", 500);
        }
        const refreshToken = this.JwtService.generateRefreshToken(user._id);
        if (!refreshToken) {
          throw new CustomError("Couldn't generate token", 500);
        }
        return {user,accessToken,refreshToken}
      } 
    } catch (error) {
      throw error;
    }
  }
}
