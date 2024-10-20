import { ObjectId } from "mongoose";
import { Iadmin } from "../../../domain/entities/admin/admin";
import { Iuser } from "../../../domain/entities/user/user";
import { Iagent } from "../../../domain/entities/agent/agent";
import { CustomError } from "../../../domain/errors/customError";

interface MongoAdminRepository {
  changePassword(email: string, password: string): unknown;
  findAdminByEmail(email: string): Promise<Iadmin | null>;
  getAdmin(id: string): Promise<Iadmin | null>;
  addRefreshToken(id: ObjectId | undefined, refreshToken: string): Promise<void>;
}
interface MongoUserRepository {
  getAllUsersData(): Promise<Iuser[] | null>;
  changeUserStatus(id: ObjectId, is_block: boolean): Promise<Iuser | null>;
}
interface MongoAgentRepository {
  getAllAgenciesData(): Promise<Iagent[] | null>;
  changeAgentStatus(id: ObjectId, is_block: boolean): Promise<Iagent | null>;
  getAgent(id:string):Promise<Iagent|null>
  adminVerifyAgent(id:string,admin_verified:string):Promise<Iagent|null>
  
}
interface EmailService {
  sendVerificationEmail(email: string, otp: string): Promise<void>;
  sendAcceptanceEmail(email: string): Promise<void>;
  sendRejectionEmail(email: string): Promise<void>;
}

interface JwtService {
  verifyRefreshToken(refreshToken: string): any;
  generateAccessToken(userId: ObjectId | undefined): string;
  generateRefreshToken(userId: ObjectId | undefined): string;
 
}

interface Dependencies {
  Repositories: {
    MongoAdminRepository: MongoAdminRepository;
    MongoUserRepository: MongoUserRepository;
    MongoAgentRepository: MongoAgentRepository;
  };
  Services: {
    EmailService: EmailService;
    JwtService: JwtService;
  };
}
export class AdminUseCase {
  private adminRepository: MongoAdminRepository;

  private userRepository: MongoUserRepository;
  private agentRepository: MongoAgentRepository;
  private emailService: EmailService;
  private JwtService: JwtService;


  constructor(Dependencies: Dependencies) {
    this.adminRepository = Dependencies.Repositories.MongoAdminRepository;

    this.agentRepository = Dependencies.Repositories.MongoAgentRepository;
    this.userRepository = Dependencies.Repositories.MongoUserRepository;
    this.emailService = Dependencies.Services.EmailService;
    this.JwtService = Dependencies.Services.JwtService;

  }
  async loginAdmin(email: string, password: string) {
    try {
      const admin = await this.adminRepository.findAdminByEmail(email);
      if (!admin) {
        throw new CustomError("Email not found", 404);
      }
      const verifiedPassword = password === admin.password;
      if (!verifiedPassword) {
        throw new CustomError("Invalid password", 401);
      }
      const accessToken = this.JwtService.generateAccessToken(admin._id);
      if(!accessToken){
        throw new CustomError("couldn't genarate token",500)
      }
      const refreshToken = this.JwtService.generateRefreshToken(admin._id);
      if(!refreshToken){
        throw new CustomError("couldn't genarate token",500)
      }
      await this.adminRepository.addRefreshToken(admin._id, refreshToken);
      return {
        admin,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error
    }
  }
  async refreshAccessToken(token: string): Promise<string> {
    try {
      try {
        const incommingRefreshToken = token;
        if (!incommingRefreshToken) {
          throw new CustomError("Invalid refresh token", 401);
        }
        const decoded = this.JwtService.verifyRefreshToken(incommingRefreshToken);
        if (!decoded) {
          throw new CustomError("Invalid refresh token", 401);
        }
        const admin = await this.adminRepository.getAdmin(decoded.userId);
        if (!admin) {
          throw new CustomError("Invalid refresh token", 401);
        }
        if (incommingRefreshToken !== admin?.refreshToken) {
          throw new CustomError("Invalid refresh token", 401);
        }
        const accessToken = this.JwtService.generateAccessToken(admin?._id);
        if (!accessToken) {
          throw new CustomError("token Error", 500);
        }      
        return accessToken;
      } catch (err) {
        throw new Error("Invalid refresh token");
      }
    } catch (err) {
      throw new Error("Invalid refresh token");
    }
  }
  async getAllUsers() {
    try {
      const users = await this.userRepository.getAllUsersData();
      if (!users || users.length === 0) {
        throw new CustomError("No users found", 404);
      }
      return users;
    } catch (error) {
      throw error
    }
  }
  async changeUserStatus(id: ObjectId, is_block: boolean) {
    try {
      const user = await this.userRepository.changeUserStatus(id, is_block);
      if (!user) {
        throw new CustomError("User status not updated", 500);
      }
      return user;
    } catch (error) {
      throw error
    }
  }
  async getAllAgencies() {
    try {
      const agencies = await this.agentRepository.getAllAgenciesData();
      if (!agencies || agencies.length === 0) {
        throw new CustomError("No agencies found", 404);
      }
      return agencies;
    } catch (error) {
      throw error
    }
  }
  async changeAgentStatus(id: ObjectId, is_block: boolean) {
    try {
      const agent = await this.agentRepository.changeAgentStatus(id, is_block);
      if (!agent) {
        throw new CustomError("Agent status not updated", 500);
      }
      return agent;
    } catch (error) {
      throw error
    }
  }
  async getAgent(id: string) {
    try {
      const agent = await this.agentRepository.getAgent(id);
      if (!agent) {
        throw new CustomError("Agent not found", 404);
      }
      return agent;
    } catch (error) {
      throw error
    }
  }
  async adminVerifyAgent(id: string, admin_verified: string) {
    try {
      const agent = await this.agentRepository.adminVerifyAgent(id, admin_verified);
      if (!agent) {
        throw new CustomError("Agent verification failed", 500);
      }
      if (admin_verified === "accept") {
        await this.emailService.sendAcceptanceEmail(agent.email);
      } else {
        await this.emailService.sendRejectionEmail(agent.email);
      }
      return agent;
    } catch (error) {
      throw error
    }
  }
}
