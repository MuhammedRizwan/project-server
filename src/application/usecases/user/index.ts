import { ObjectId } from "mongoose";
import { Iuser } from "../../../domain/entities/user/user";
import { IOTP } from "../../../domain/entities/user/otp";

interface UserRepository {
  createUser(user: Iuser): Promise<Iuser>;
  findUserByEmail(email: string): Promise<Iuser | null>;
}
interface OTPRepository{
  createOTP({email,otp}:{email:string,otp:string}):Promise<IOTP>
  findOTPbyEmail(email:string):Promise<IOTP|null>
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
  generateAccessToken(userId: ObjectId | undefined): string;
  generateRefreshToken(userId: ObjectId | undefined): string;
}

interface Dependencies {
  Repositories: {
    MongoUserRepository: UserRepository;
    MongoOTPRepository:OTPRepository;
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
  private OTPRepository:OTPRepository
  private emailService: EmailService;
  private passwordService: PasswordService;
  private generateOtp: GenerateOtp;
  private JwtService: JwtService;

  constructor(dependencies: Dependencies) {
    this.userRepository = dependencies.Repositories.MongoUserRepository;
    this.OTPRepository=dependencies.Repositories.MongoOTPRepository;
    this.emailService = dependencies.services.EmailService;
    this.passwordService = dependencies.services.PasswordService;
    this.generateOtp = dependencies.services.GenerateOtp;
    this.JwtService = dependencies.services.JwtService;
  }
  async signupUser(userData: Iuser) {
    const existUser = await this.userRepository.findUserByEmail(userData.email);
    if (existUser) {
      throw new Error("user already exists");
    }
    userData.password = await this.passwordService.passwordHash(
      userData.password
    );
    const verificationOtp = this.generateOtp.generate();
    if(!verificationOtp){
      throw new Error ('something went wrong')
    }
    const createOTP= await this.OTPRepository.createOTP({email:userData.email,otp:verificationOtp})
    if(!createOTP){
      throw new Error ('OTP creation failed')
    }
    await this.emailService.sendVerificationEmail(
      userData.email,
      verificationOtp
    );
    const user=await this.userRepository.createUser(userData);
    if(!user){
      throw new Error("something went wrong cannot signup user");
    }
    const accessToken = this.JwtService.generateAccessToken(user._id);
    const refreshToken = this.JwtService.generateRefreshToken(user._id);
    return{
      userDetails: user,
      accessToken,
      refreshToken
    }
  }
  async signinUser(email: string, password: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("Email Not Found");
    }
    const verifiedPassword = await this.passwordService.verifyPassword(
      password,
      user.password
    );
    if (verifiedPassword) {
      throw new Error("Invalid password");
    }
    const accessToken = this.JwtService.generateAccessToken(user._id);
    const refreshToken = this.JwtService.generateRefreshToken(user._id);

    return {
      userDetails: user,
      accessToken,
      refreshToken
    };
  }
}
