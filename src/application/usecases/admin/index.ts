import { ObjectId } from "mongoose";
import { UserRepository } from "../../../domain/entities/user/user";
import { CustomError } from "../../../domain/errors/customError";
import { AdminRepository } from "../../../domain/entities/admin/admin";
import { AgentRepository } from "../../../domain/entities/agent/agent";
import { EmailService, JwtService } from "../../../domain/entities/services/service";
import { Dependencies } from "../../../domain/entities/depencies/depencies";


export class AdminUseCase {
  private _adminRepository: AdminRepository;
  private _userRepository: UserRepository;
  private _agentRepository: AgentRepository;
  private _emailService: EmailService;
  private _JwtService: JwtService;

  constructor(Dependencies: Dependencies) {
    this._adminRepository = Dependencies.Repositories.AdminRepository;
    this._agentRepository = Dependencies.Repositories.AgentRepository;
    this._userRepository = Dependencies.Repositories.UserRepository;
    this._emailService = Dependencies.Services.EmailService;
    this._JwtService = Dependencies.Services.JwtService;
  }
  async loginAdmin(email: string, password: string) {
    try {
      const admin = await this._adminRepository.findAdminByEmail(email);
      if (!admin) {
        throw new CustomError("Email not found", 404);
      }
      const verifiedPassword = password === admin.password;
      if (!verifiedPassword) {
        throw new CustomError("Invalid password", 403);
      }
      const accessToken = this._JwtService.generateAccessToken(admin._id);
      if (!accessToken) {
        throw new CustomError("couldn't genarate token", 500);
      }
      const refreshToken = this._JwtService.generateRefreshToken(admin._id);
      if (!refreshToken) {
        throw new CustomError("couldn't genarate token", 500);
      }
      await this._adminRepository.addRefreshToken(admin._id, refreshToken);
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
        const decoded = this._JwtService.verifyRefreshToken(
          incommingRefreshToken
        );
        if (!decoded) {
          throw new CustomError("Invalid refresh token", 401);
        }
        const admin = await this._adminRepository.getAdmin(decoded.userId);
        if (!admin) {
          throw new CustomError("Invalid refresh token", 401);
        }
        if (incommingRefreshToken !== admin?.refreshToken) {
          throw new CustomError("Invalid refresh token", 401);
        }
        const accessToken = this._JwtService.generateAccessToken(admin?._id);
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

      const users = await this._userRepository.getAllUsersData(
        query,
        page,
        limit,
        filterData
      );
      if (!users || users.length === 0) {
        throw new CustomError("No users found", 404);
      }
      const totalItems = await this._userRepository.countUsers(query,filterData);
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
      const user = await this._userRepository.changeUserStatus(id, is_block);
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
      const agencies = await this._agentRepository.getAllAgenciesData(
        query,
        page,
        limit,
        filterData
      );
      if (!agencies || agencies.length === 0) {
        throw new CustomError("No agencies found", 404);
      }
      const totalItems = await this._agentRepository.countAgencies(query,filterData);
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
      const agent = await this._agentRepository.changeAgentStatus(id, is_block);
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
      const agent = await this._agentRepository.getAgent(id);
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
      const agent = await this._agentRepository.adminVerifyAgent(
        id,
        admin_verified
      );
      if (!agent) {
        throw new CustomError("Agent verification failed", 500);
      }
      if (admin_verified === "accept") {
        await this._emailService.sendAcceptanceEmail(agent.email);
      } else {
        await this._emailService.sendRejectionEmail(agent.email);
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
