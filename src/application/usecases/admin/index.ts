import { ObjectId } from "mongoose";
import { UserRepository } from "../../../domain/entities/user/user";
import { CustomError } from "../../../domain/errors/customError";
import { AdminRepository } from "../../../domain/entities/admin/admin";
import { AgentRepository } from "../../../domain/entities/agent/agent";
import {
  EmailService,
  JwtService,
} from "../../../domain/entities/services/service";
import { Dependencies } from "../../../domain/entities/depencies/depencies";
import { PackageRepository } from "../../../domain/entities/package/package";
import { BookingRepository } from "../../../adapters/repositories/booking.repository";
import { response } from "express";
import { WalletRepository } from "../../../domain/entities/wallet/wallet";
import configKeys from "../../../config";

export class AdminUseCase {
  private _adminRepository: AdminRepository;
  private _userRepository: UserRepository;
  private _agentRepository: AgentRepository;
  private _packageRepository: PackageRepository;
  private _bookingRepository: BookingRepository;
  private _walletRepository: WalletRepository;
  private _emailService: EmailService;
  private _JwtService: JwtService;

  constructor(Dependencies: Dependencies) {
    this._adminRepository = Dependencies.Repositories.AdminRepository;
    this._agentRepository = Dependencies.Repositories.AgentRepository;
    this._userRepository = Dependencies.Repositories.UserRepository;
    this._packageRepository = Dependencies.Repositories.PackageRepository;
    this._bookingRepository = Dependencies.Repositories.BookingRepository;
    this._walletRepository = Dependencies.Repositories.WalletRepository;
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
  async getAllUsers(
    search: string,
    page: number,
    limit: number,
    filter: string
  ) {
    try {
      const query = search
        ? { username: { $regex: search, $options: "i" } }
        : {};
      const filterData =
        filter === "all"
          ? {}
          : { is_block: filter === "blocked" ? true : false };

      const users = await this._userRepository.getAllUsersData(
        query,
        page,
        limit,
        filterData
      );
      if (!users || users.length === 0) {
        throw new CustomError("No users found", 404);
      }
      const totalItems = await this._userRepository.countUsers(
        query,
        filterData
      );
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
  async getAllAgencies(
    search: string,
    page: number,
    limit: number,
    filter: string
  ) {
    try {
      const query = search
        ? { agency_name: { $regex: search, $options: "i" } }
        : {};
      const filterData =
        filter === "all"
          ? {}
          : { is_block: filter === "blocked" ? true : false };
      const agencies = await this._agentRepository.getAllAgenciesData(
        query,
        page,
        limit,
        filterData
      );
      if (!agencies || agencies.length === 0) {
        throw new CustomError("No agencies found", 404);
      }
      const totalItems = await this._agentRepository.countAgencies(
        query,
        filterData
      );
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
      await this._walletRepository.createWallet(agent._id);
      return agent;
    } catch (error) {
      throw error;
    }
  }
  async getDashboardData() {
    try {
      const users = await this._userRepository.getAllUsersCount();
      if (!users) {
        throw new CustomError("User Not Found", 404);
      }
      const agent = await this._agentRepository.getAllAgentCount();
      if (!agent) {
        throw new CustomError("Agent Not Found", 404);
      }
      const packages = await this._packageRepository.getAllPackageCount();
      if (!packages) {
        throw new CustomError("Pcakge Not Found", 404);
      }
      const bookings = await this._bookingRepository.getAllBookingsCount();
      if (!bookings) {
        throw new CustomError("booking Not Found", 404);
      }
      const revenue = await this._walletRepository.getWallet(
        configKeys.ADMIN_ID
      );
      if (!revenue) {
        throw new CustomError("revenue Not Found", 404);
      }
      const unconfirmedagency = await this._agentRepository.unconfirmedagent();
      return { users, agent, packages, bookings, revenue, unconfirmedagency };
    } catch (error) {
      throw error;
    }
  }
  async getAllAgents() {
    try {
      const agents = await this._agentRepository.getAllagent();
      if (!agents) {
        throw new CustomError("Agent Not Found", 404);
      }
      return agents;
    } catch (error) {
      throw error;
    }
  }
  async getAgentBookingData(agentId: string) {
    try {
      const agentBookingData =
        await this._bookingRepository.getAgentBookingData(agentId);
      if (!agentBookingData) {
        throw new CustomError("No agent booking data found", 404);
      }
      return agentBookingData;
    } catch (error) {
      throw error;
    }
  }
  async getBarChartData() {
    try {
      const bookings = await this._bookingRepository.gookingData();
      if (bookings.length === 0) {
        throw new CustomError("No booking data found", 404);
      }
      const walletTransactions = await this._walletRepository.WalletData();
      if (walletTransactions.length === 0) {
        throw new CustomError("No wallet data found", 404);
      }
      const data = Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;
        const bookingData = bookings.find((b) => b._id === month) || {
          totalBookings: 0,
        };
        const walletData = walletTransactions.find(
          (w) => w._id === month
        ) || {
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
