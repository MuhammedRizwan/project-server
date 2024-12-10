import { ObjectId } from "mongoose";
import { UserRepository } from "../../../domain/entities/user/user";
import { CustomError } from "../../../domain/errors/customError";
import { AdminRepository } from "../../../domain/entities/admin/admin";
import { AgentRepository } from "../../../domain/entities/agent/agent";
import { EmailService, JwtService } from "../../../domain/entities/services/service";

interface Dependencies {
  Repositories: {
    AdminRepository: AdminRepository;
    UserRepository: UserRepository;
    AgentRepository: AgentRepository;
  };
  Services: {
    EmailService: EmailService;
    JwtService: JwtService;
  };
}
export class AdminUseCase {
  private adminRepository: AdminRepository;

  private userRepository: UserRepository;
  private agentRepository: AgentRepository;
  private emailService: EmailService;
  private JwtService: JwtService;

  constructor(Dependencies: Dependencies) {
    this.adminRepository = Dependencies.Repositories.AdminRepository;

    this.agentRepository = Dependencies.Repositories.AgentRepository;
    this.userRepository = Dependencies.Repositories.UserRepository;
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
        throw new CustomError("Invalid password", 403);
      }
      const accessToken = this.JwtService.generateAccessToken(admin._id);
      if (!accessToken) {
        throw new CustomError("couldn't genarate token", 500);
      }
      const refreshToken = this.JwtService.generateRefreshToken(admin._id);
      if (!refreshToken) {
        throw new CustomError("couldn't genarate token", 500);
      }
      await this.adminRepository.addRefreshToken(admin._id, refreshToken);
      return {
        admin,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }
  async refreshAccessToken(token: string): Promise<string> {
    try {
      try {
        const incommingRefreshToken = token;
        if (!incommingRefreshToken) {
          throw new CustomError("Invalid refresh token", 401);
        }
        const decoded = this.JwtService.verifyRefreshToken(
          incommingRefreshToken
        );
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
  async getAllUsers(search: string, page: number, limit: number,filter:string) {
    try {
      
      const query = search
        ? { username: { $regex: search, $options: "i" } }
        : {};
        const filterData =filter === "all"? {}: { is_block: filter === "blocked" ? true : false };

      const users = await this.userRepository.getAllUsersData(
        query,
        page,
        limit,
        filterData
      );
      if (!users || users.length === 0) {
        throw new CustomError("No users found", 404);
      }
      const totalItems = await this.userRepository.countUsers(query,filterData);
      if (totalItems === 0) {
        throw new CustomError("No users found", 404);
      }
      return {
        users,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      };
    } catch (error) {
      throw error;
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
      throw error;
    }
  }
  async getAllAgencies(search: string, page: number, limit: number,filter:string) {
    try {
      const query = search
        ? { agency_name: { $regex: search, $options: "i" } }
        : {};
        const filterData =filter === "all"? {}: { is_block: filter === "blocked" ? true : false };
      const agencies = await this.agentRepository.getAllAgenciesData(
        query,
        page,
        limit,
        filterData
      );
      if (!agencies || agencies.length === 0) {
        throw new CustomError("No agencies found", 404);
      }
      const totalItems = await this.agentRepository.countAgencies(query,filterData);
      if (totalItems === 0) {
        throw new CustomError("No agencies found", 404);
      }
      return {
        agencies,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      };
    } catch (error) {
      throw error;
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
      throw error;
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
      throw error;
    }
  }
  async adminVerifyAgent(id: string, admin_verified: string) {
    try {
      const agent = await this.agentRepository.adminVerifyAgent(
        id,
        admin_verified
      );
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
      throw error;
    }
  }
  // async usersData(){
  //   try {
  //     const users = await this.userRepository.getAllUsers();
  //     return users;
  //   } catch (error) {
  //     throw error;
  // }
}
