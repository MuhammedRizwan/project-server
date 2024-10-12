import { ObjectId } from "mongoose";
import { Iagent } from "../../../domain/entities/agent/agent";
import { IOTP } from "../../../domain/entities/user/otp";
import { CustomError } from "../../../domain/errors/customError";

interface MongoAgentRepository {
  createAgent(agent: Iagent): Promise<Iagent>;
  findAgentByEmail(email: string): Promise<Iagent | null>;
  addRefreshToken(id: ObjectId|undefined, refreshToken: string): Promise<void>;
  verifyAgent(email: string): Promise<Iagent | null>;
}
interface MongoOTPRepository {
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
  generateAccessToken(userId: ObjectId | undefined): string;
  generateRefreshToken(userId: ObjectId | undefined): string;
}
interface CloudinaryService {
  uploadImage(file: Express.Multer.File): Promise<string>;
  uploadPDF(file: Express.Multer.File): Promise<string>;
}

interface Dependencies {
  Repositories: {
    MongoAgentRepository: MongoAgentRepository;
    MongoOTPRepository: MongoOTPRepository;
  };
  Services: {
    EmailService: EmailService;
    PasswordService: PasswordService;
    GenerateOtp: GenerateOtp;
    JwtService: JwtService;
    CloudinaryService: CloudinaryService;
  };
}
export class AgentUseCase {
  private agentRepository: MongoAgentRepository;
  private OTPRepository: MongoOTPRepository;
  private emailService: EmailService;
  private passwordService: PasswordService;
  private JwtService: JwtService;
  private generateOtp: GenerateOtp;
  private CloudinaryService: CloudinaryService;

  constructor(Dependencies: Dependencies) {
    this.agentRepository = Dependencies.Repositories.MongoAgentRepository;
    this.OTPRepository = Dependencies.Repositories.MongoOTPRepository;
    this.emailService = Dependencies.Services.EmailService;
    this.passwordService = Dependencies.Services.PasswordService;
    this.JwtService = Dependencies.Services.JwtService;
    this.generateOtp = Dependencies.Services.GenerateOtp;
    this.CloudinaryService = Dependencies.Services.CloudinaryService;
  }
  async signupAgent(
    agentData: Iagent,
    file: { Document: Express.Multer.File | undefined }
  ) {
    try {
      const existUser = await this.agentRepository.findAgentByEmail(
        agentData.email
      );
      if (existUser) {
        throw new CustomError("user already exists", 409);
      }
      let uploadDocumentUrl: string | null = null;
      if (file.Document) {
        const fileType = file.Document?.mimetype;
        console.log(fileType);
        if (fileType === "application/pdf") {
          const pdfUrl = await this.CloudinaryService.uploadPDF(file.Document);
          if (!pdfUrl) {
            throw new CustomError("pdf cannot upload to cloudinary", 500);
          }
          agentData.DocumentURL = pdfUrl;
        } else if (fileType.startsWith("image/")) {
          const imageUrl = await this.CloudinaryService.uploadImage(
            file.Document
          );
          if (!imageUrl) {
            throw new CustomError("image cannot upload to cloudinary", 500);
          }
          agentData.DocumentURL = imageUrl;
        }
      }

      agentData.password = await this.passwordService.passwordHash(
        agentData.password
      );
      const verificationOtp = this.generateOtp.generate();
      if (!verificationOtp) {
        throw new CustomError("something went wrong", 500);
      }
      const createOTP = await this.OTPRepository.createOTP({
        email: agentData.email,
        otp: verificationOtp,
      });
      if (!createOTP) {
        throw new CustomError("OTP creation failed", 500);
      }
      await this.emailService.sendVerificationEmail(
        agentData.email,
        verificationOtp
      );
      const agent = await this.agentRepository.createAgent(agentData);
      if (!agent) {
        throw new CustomError("cannot signup user", 404);
      }
      return agent;
    } catch (error) {
      throw error;
    }
  }
  async loginAgent(email: string, password: string) {
    const agent = await this.agentRepository.findAgentByEmail(email);
    if (!agent) {
      throw new CustomError("Email Not Found", 404);
    }
    const verifiedPassword = await this.passwordService.verifyPassword(
      password,
      agent.password
    );
    if (!verifiedPassword) {
      throw new CustomError("Invalid password", 403);
    }
    if (agent.is_block) {
      throw new CustomError("Agency has been Blocked", 403);
    }
    if (!agent.is_verified) {
      const verificationOtp = this.generateOtp.generate();
      if (!verificationOtp) {
        throw new CustomError("couldn't genarate OTP",500);
      }
      const createOTP = await this.OTPRepository.createOTP({
        email: agent.email,
        otp: verificationOtp,
      });
      if (!createOTP) {
        throw new CustomError("OTP creation failed",500);
      }
      await this.emailService.sendVerificationEmail(
        agent.email,
        verificationOtp
      );
    }
    if (agent.admin_verified == "reject") {
      throw new CustomError("Agency were Rejected",400);
    }
    const accessToken = this.JwtService.generateAccessToken(agent._id);
    if(!accessToken){
      throw new CustomError("couldn't genarate token",500)
    }
    const refreshToken = this.JwtService.generateRefreshToken(agent._id);
    if(!refreshToken){
      throw new CustomError("couldn't genarate token",500)
    }
     await this.agentRepository.addRefreshToken(
      agent._id,
      refreshToken
    )
    return {
      agent,
      accessToken,
      refreshToken,
    };
  }
}
