import { AgentRepository} from "../../../domain/entities/agent/agent";
import { CustomError } from "../../../domain/errors/customError";
import { EmailService, GenerateOtp, JwtService, PasswordService } from "../../../domain/entities/services/service";
import { OTPRepository } from "../../../adapters/repositories/otp.repositories";
import { Dependencies } from "../../../domain/entities/depencies/depencies";

export class AgentVerification {
  private _jwtService: JwtService;
  private _OTPRepository: OTPRepository;
  private _agentRepository: AgentRepository;
  private _generateOtp: GenerateOtp;
  private _emailService: EmailService;
  private _passwordService: PasswordService;

  constructor(dependencies: Dependencies) {
    this._jwtService = dependencies.Services.JwtService;
    this._OTPRepository = dependencies.Repositories.OTPRepository;
    this._agentRepository = dependencies.Repositories.AgentRepository;
    this._generateOtp = dependencies.Services.GenerateOtp;
    this._emailService = dependencies.Services.EmailService;
    this._passwordService = dependencies.Services.PasswordService;
  }

  async refreshAccessToken(token: string): Promise<string> {
    try {
      const incommingRefreshToken = token;
      if (!incommingRefreshToken) {
        throw new CustomError("Invalid refresh token", 401);
      }
      const decoded = this._jwtService.verifyRefreshToken(incommingRefreshToken);
      if (!decoded) {
        throw new CustomError("Invalid refresh token", 401);
      }
      const agent = await this._agentRepository.getAgent(decoded.userId);
      if (!agent) {
        throw new CustomError("Invalid refresh token", 401);
      }
      if (incommingRefreshToken !== agent?.refreshToken) {
        throw new CustomError("Invalid refresh token", 401);
      }
      const accessToken = this._jwtService.generateAccessToken(agent?._id);
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
      const OTP = await this._OTPRepository.findOTPbyEmail(email);
      if (!OTP) {
        throw new CustomError("OTP expired", 410);
      }
      if (OTP.otp !== Otp) {
        throw new CustomError("Incorrect OTP", 403);
      }
      const agentData = await this._agentRepository.verifyAgent(email);
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
      const existUser = await this._agentRepository.findAgentByEmail(email);
      if (!existUser) {
        throw new CustomError("Agency not exist", 404);
      }
      const verificationOtp = this._generateOtp.generate();
      if (!verificationOtp) {
        throw new CustomError("something went wrong", 500);
      }
      await this._emailService.sendVerificationEmail(email, verificationOtp);
      const createOTP = await this._OTPRepository.createOTP({
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
      const isAgent = await this._agentRepository.findAgentByEmail(email);
      if (!isAgent) {
        throw new CustomError("Invalid user", 404);
      }
      password = await this._passwordService.passwordHash(password);
      const updatePassword = this._agentRepository.changePassword(
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
