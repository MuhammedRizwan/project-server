
import { IOTP } from "../../../domain/entities/user/otp";
import { Iagent } from "../../../domain/entities/agent/agent";
import { CustomError } from "../../../domain/errors/customError";

// interface DecodedToken extends JwtPayload {
//   userId: ObjectId;
// }

interface JwtService {
  verifyRefreshToken(refreshToken: string): any;
  generateAccessToken(userId: string | undefined): string;
  generateRefreshToken(userId: string | undefined): string;
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
interface AgentRepository {
  findAgentByEmail(email: string): Promise<Iagent | null>;
  verifyAgent(email: string): Promise<Iagent | null>;
  changePassword(email: string, password: string): Promise<Iagent | null>;
  getAgent(userId: string): Promise<Iagent | null>;
}

interface OTPRepository {
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
    OTPRepository: OTPRepository;
    AgentRepository: AgentRepository;
  };
}

export class AgentVerification {
  private jwtService: JwtService;
  private OTPRepository: OTPRepository;
  private agentRepository: AgentRepository;
  private generateOtp: GenerateOtp;
  private emailService: EmailService;
  private passwordService: PasswordService;

  constructor(dependencies: Dependencies) {
    this.jwtService = dependencies.Services.JwtService;
    this.OTPRepository = dependencies.Repositories.OTPRepository;
    this.agentRepository = dependencies.Repositories.AgentRepository;
    this.generateOtp = dependencies.Services.GenerateOtp;
    this.emailService = dependencies.Services.EmailService;
    this.passwordService = dependencies.Services.PasswordService;
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
      const agent = await this.agentRepository.getAgent(decoded.userId);
      if (!agent) {
        throw new CustomError("Invalid refresh token", 401);
      }
      if (incommingRefreshToken !== agent?.refreshToken) {
        throw new CustomError("Invalid refresh token", 401);
      }
      const accessToken = this.jwtService.generateAccessToken(agent?._id);
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
        throw new CustomError("Agency not exist", 404);
      }
      const verificationOtp = this.generateOtp.generate();
      if (!verificationOtp) {
        throw new CustomError("something went wrong", 500);
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
      const isAgent = await this.agentRepository.findAgentByEmail(email);
      if (!isAgent) {
        throw new CustomError("Invalid user", 404);
      }
      password = await this.passwordService.passwordHash(password);
      const updatePassword = this.agentRepository.changePassword(
        email,
        password
      );
      if (!updatePassword) {
        throw new CustomError("password not updated", 500);
      }
      return updatePassword;
    } catch (error) {
      throw error;
    }
  }
}
