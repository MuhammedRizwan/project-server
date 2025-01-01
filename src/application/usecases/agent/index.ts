import { Socket } from "socket.io";
import { AgentRepository, Iagent } from "../../../domain/entities/agent/agent";
import { BookingRepository } from "../../../domain/entities/booking/booking";
import { Dependencies } from "../../../domain/entities/depencies/depencies";
import { OTPRepository } from "../../../domain/entities/OTP/otp";
import { PackageRepository } from "../../../domain/entities/package/package";
import {
  CloudinaryService,
  EmailService,
  GenerateOtp,
  JwtService,
  PasswordService,
} from "../../../domain/entities/services/service";
import { WalletRepository } from "../../../domain/entities/wallet/wallet";
import { CustomError } from "../../../domain/errors/customError";
import HttpStatusCode from "../../../domain/enum/httpstatus";

export class AgentUseCase {
  private _agentRepository: AgentRepository;
  private _bookingRepository: BookingRepository;
  private _packageRepository: PackageRepository;
  private _OTPRepository: OTPRepository;
  private _walletRepository: WalletRepository;
  private _emailService: EmailService;
  private _passwordService: PasswordService;
  private _JwtService: JwtService;
  private _generateOtp: GenerateOtp;
  private _CloudinaryService: CloudinaryService;

  constructor(Dependencies: Dependencies) {
    this._agentRepository = Dependencies.Repositories.AgentRepository;
    this._bookingRepository = Dependencies.Repositories.BookingRepository;
    this._packageRepository = Dependencies.Repositories.PackageRepository;
    this._OTPRepository = Dependencies.Repositories.OTPRepository;
    this._walletRepository = Dependencies.Repositories.WalletRepository;
    this._emailService = Dependencies.Services.EmailService;
    this._passwordService = Dependencies.Services.PasswordService;
    this._JwtService = Dependencies.Services.JwtService;
    this._generateOtp = Dependencies.Services.GenerateOtp;
    this._CloudinaryService = Dependencies.Services.CloudinaryService;
  }
  async signupAgent(
    agentData: Iagent,
    file: { Document: Express.Multer.File | undefined }
  ) {
    try {
      const existUser = await this._agentRepository.findAgentByEmail(
        agentData.email
      );
      if (existUser) {
        throw new CustomError("user already exists", HttpStatusCode.CONFLICT);
      }
      let uploadDocumentUrl: string | null = null;
      if (file.Document) {
        const fileType = file.Document?.mimetype;
        if (fileType === "application/pdf") {
          const pdfUrl = await this._CloudinaryService.uploadPDF(file.Document);
          if (!pdfUrl) {
            throw new CustomError("pdf cannot upload to cloudinary", HttpStatusCode.INTERNAL_SERVER_ERROR);
          }
          agentData.DocumentURL = pdfUrl;
        } else if (fileType.startsWith("image/")) {
          const imageUrl = await this._CloudinaryService.uploadImage(
            file.Document
          );
          if (!imageUrl) {
            throw new CustomError("image cannot upload to cloudinary", HttpStatusCode.INTERNAL_SERVER_ERROR);
          }
          agentData.DocumentURL = imageUrl;
        }
      }

      agentData.password = await this._passwordService.passwordHash(
        agentData.password
      );
      const verificationOtp = this._generateOtp.generate();
      if (!verificationOtp) {
        throw new CustomError("something went wrong", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      const createOTP = await this._OTPRepository.createOTP({
        email: agentData.email,
        otp: verificationOtp,
      });
      if (!createOTP) {
        throw new CustomError("OTP creation failed", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      await this._emailService.sendVerificationEmail(
        agentData.email,
        verificationOtp
      );
      const agent = await this._agentRepository.createAgent(agentData);
      if (!agent) {
        throw new CustomError("cannot signup user", HttpStatusCode.NOT_FOUND);
      }

      return agent;
    } catch (error) {
      throw error;
    }
  }
  async loginAgent(email: string, password: string) {
    const agent = await this._agentRepository.findAgentByEmail(email);
    if (!agent) {
      throw new CustomError("Email Not Found", HttpStatusCode.NOT_FOUND);
    }
    const verifiedPassword = await this._passwordService.verifyPassword(
      password,
      agent.password
    );
    if (!verifiedPassword) {
      throw new CustomError("Invalid password", HttpStatusCode.FORBIDDEN);
    }
    if (agent.is_block) {
      throw new CustomError("Agency has been Blocked", HttpStatusCode.FORBIDDEN);
    }
    if (!agent.is_verified) {
      const verificationOtp = this._generateOtp.generate();
      if (!verificationOtp) {
        throw new CustomError("couldn't genarate OTP", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      const createOTP = await this._OTPRepository.createOTP({
        email: agent.email,
        otp: verificationOtp,
      });
      if (!createOTP) {
        throw new CustomError("OTP creation failed", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      await this._emailService.sendVerificationEmail(
        agent.email,
        verificationOtp
      );
    }
    if (agent.admin_verified == "reject") {
      throw new CustomError("Agency were Rejected", HttpStatusCode.BAD_REQUEST);
    }
    if (agent.admin_verified !== "accept") {
      throw new CustomError("Agency are not verified", HttpStatusCode.BAD_REQUEST);
    }
    const accessToken = this._JwtService.generateAccessToken(agent._id);
    if (!accessToken) {
      throw new CustomError("couldn't genarate token", HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
    const refreshToken = this._JwtService.generateRefreshToken(agent._id);
    if (!refreshToken) {
      throw new CustomError("couldn't genarate token", HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
    await this._agentRepository.addRefreshToken(agent._id, refreshToken);
    return {
      agent,
      accessToken,
      refreshToken,
    };
  }
  async getAgent(agentId: string) {
    try {
      const agent = await this._agentRepository.getAgent(agentId);
      if (!agent) {
        throw new CustomError("Agent not found", HttpStatusCode.NOT_FOUND);
      }
      return agent;
    } catch (error) {
      throw error;
    }
  }
  async updateAgent(
    agentId: string,
    agentData: Iagent,
    file: Express.Multer.File | undefined
  ) {
    try {
      const image = file
        ? await this._CloudinaryService.uploadImage(file)
        : null;
      if (image) {
        agentData.profile_picture = image;
      }
      const agent = await this._agentRepository.updateAgent(agentId, agentData);
      if (!agent) {
        throw new CustomError("Agent not found", HttpStatusCode.NOT_FOUND);
      }
      return agent;
    } catch (error) {
      throw error;
    }
  }
  async validatePassword(agentId: string, password: string) {
    try {
      const agent = await this._agentRepository.getAgent(agentId);
      if (!agent) {
        throw new CustomError("Agent not found", HttpStatusCode.NOT_FOUND);
      }
      const verifiedPassword = await this._passwordService.verifyPassword(
        password,
        agent.password
      );
      if (!verifiedPassword) {
        throw new CustomError("Invalid password", HttpStatusCode.NOT_FOUND);
      }
      return agent;
    } catch (error) {
      throw error;
    }
  }
  async updatePassword(agentId: string, newPassword: string) {
    try {
      const agent = await this._agentRepository.updatePassword(
        agentId,
        newPassword
      );
      if (!agent) {
        throw new CustomError("Agent not found", HttpStatusCode.NOT_FOUND);
      }
      return agent;
    } catch (error) {
      throw error;
    }
  }
  async getDashboard(agentId: string) {
    try {
      const packages = await this._packageRepository.getpackageCount(agentId);
      if (!packages) {
        throw new CustomError("packages not found", HttpStatusCode.NOT_FOUND);
      }
      const booking = await this._bookingRepository.getAgentBookingData(
        agentId
      );
      if (!booking) {
        throw new CustomError("booking not found", HttpStatusCode.NOT_FOUND);
      }
      const bookingRevenue =
        await this._bookingRepository.getAgentBookingRevenue(agentId);
      if (!bookingRevenue) {
        throw new CustomError("revenue not found", HttpStatusCode.NOT_FOUND);
      }
      return {
        packages,
        booking,
        bookingRevenue,
      };
    } catch (error) {
      throw error;
    }
  }
  async getBarChart(agentId: string) {
    try {
      const bookings = await this._bookingRepository.agentBookings(agentId);
      if (!bookings) {
        throw new CustomError("revenue not found", HttpStatusCode.NOT_FOUND);
      }
      const walletTransactions = await this._walletRepository.getWalletData(
        agentId
      );
      const data = Array.from({ length: 12 }, (_, index) => {
        const month = index + 1; // Month starts at 1
        const bookingData = bookings.find((b) => b._id === month) || {
          totalBookings: 0,
        };
        const walletData = walletTransactions.find((w) => w._id === month) || {
          totalTransactions: 0,
        };

        return {
          month,
          totalBookings: bookingData.totalBookings,
          totalTransactions: walletData.totalTransactions,
        };
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
