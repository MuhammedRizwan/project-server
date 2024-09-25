import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongoose";
import { IOTP } from "../../../domain/entities/user/otp";
import { Iagent } from "../../../domain/entities/agent/agent";
import { CustomError } from "../../../domain/errors/customError";

// interface DecodedToken extends JwtPayload {
//   userId: ObjectId;
// }

interface JwtService {
  verifyRefreshToken(refreshToken: string): any;
  generateAccessToken(userId: ObjectId | undefined): string;
  generateRefreshToken(userId: ObjectId | undefined): string;
}
interface GenerateOtp {
  generate(): string;
}
interface PasswordService {
  passwordHash(password: string): Promise<string>;
}
interface EmailService {
  sendVerificationEmail(email: string, otp: string): Promise<void>;
}
interface MongoAgentRepository {
  findAgentByEmail(email: string): Promise<Iagent | null>;
  verifyAgent(email: string): Promise<Iagent | null>;
  changePassword(email: string, password: string): Promise<Iagent | null>;
}

interface MongoOTPRepository {
  createOTP({ email, otp }: { email: string; otp: string }): Promise<IOTP>;
  findOTPbyEmail(email: string): Promise<IOTP | null>;
}

interface Dependencies {
  Services: {
    JwtService: JwtService;
    EmailService: EmailService;
    GenerateOtp: GenerateOtp;
    PasswordService: PasswordService;
  };
  Repositories: {
    MongoOTPRepository: MongoOTPRepository;
    MongoAgentRepository: MongoAgentRepository;
  };
}

export class AgentVerification {
  private jwtService: JwtService;
  private OTPRepository: MongoOTPRepository;
  private agentRepository: MongoAgentRepository;
  private generateOtp: GenerateOtp;
  private emailService: EmailService;
  private passwordService: PasswordService;

  constructor(dependencies: Dependencies) {
    this.jwtService = dependencies.Services.JwtService;
    this.OTPRepository = dependencies.Repositories.MongoOTPRepository;
    this.agentRepository = dependencies.Repositories.MongoAgentRepository;
    this.generateOtp = dependencies.Services.GenerateOtp;
    this.emailService = dependencies.Services.EmailService;
    this.passwordService = dependencies.Services.PasswordService;
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = this.jwtService.verifyRefreshToken(refreshToken);
      const accessToken = this.jwtService.generateAccessToken(decoded.userId);
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
        throw new CustomError("Incorrect OTP", 403);
      }
      const agentData = await this.agentRepository.verifyAgent(email);
      if (!agentData) {
        throw new CustomError("couldn't verify", 400);
      }
      return agentData;
    } catch (error) {
      throw error;
    }
  }
  async sendOTP(email: string) {
    try {
      const existUser = await this.agentRepository.findAgentByEmail(email);
      if (!existUser) {
        throw new CustomError("Agency not exist",404);
      }
      const verificationOtp = this.generateOtp.generate();
      if (!verificationOtp) {
        throw new CustomError("something went wrong",500);
      }
      await this.emailService.sendVerificationEmail(
        email,
        verificationOtp
      );
      const createOTP = await this.OTPRepository.createOTP({
        email: email,
        otp: verificationOtp,
      });
      if (!createOTP) {
        throw new CustomError("OTP creation failed",500);
      }
      return createOTP;
    } catch (error) {
      throw error;
    }
  }
  async changePassword(email: string, password: string) {
    try {
      const isAgent = await this.agentRepository.findAgentByEmail(email);
      if (!isAgent) {
        throw new CustomError("Invalid user",404);
      }
      password = await this.passwordService.passwordHash(password);
      const updatePassword = this.agentRepository.changePassword(email, password);
      if (!updatePassword) {
        throw new CustomError("password not updated",500);
      }
      return updatePassword;
    } catch (error) {
      throw error
    }
  }
}
