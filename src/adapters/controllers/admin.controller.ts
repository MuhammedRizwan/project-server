import { NextFunction, Request, Response } from "express";
import { AdminUseCase } from "../../application/usecases/admin";
import { Iadmin } from "../../domain/entities/admin/admin";

interface Dependencies {
  useCase: {
    AdminUseCase: AdminUseCase;
  };
}
export const isString = (value: unknown): value is string => typeof value === "string";

export class adminController {
  private AdminUseCase: AdminUseCase;
  constructor(dependencies: Dependencies) {
    this.AdminUseCase = dependencies.useCase.AdminUseCase;
  }

  async loginAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as Iadmin;
      const { admin, accessToken, refreshToken } =
        await this.AdminUseCase.loginAdmin(email, password);
      return res.status(200).json({
        success: true,
        message: "Admin Logged In",
        admin,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return next(error);
    }
  }
  async RefreshAccessToken(req: Request, res: Response) {
    try {
      const accessToken = await this.AdminUseCase.refreshAccessToken(
        req.body.refreshToken
      );
      if (!accessToken) {
        return res.json("token expired");
      }
      return res.json({ accessToken });
    } catch (error) {
      const err = error as Error;
      return res.status(400).json({ error: err.message });
    }
  }
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const search = isString(req.query.search) ? req.query.search : "";
      const page = isString(req.query.page) ? parseInt(req.query.page, 10) : 1;
      const limit = isString(req.query.limit)
        ? parseInt(req.query.limit, 10)
        : 8;
        const filter=isString(req.query.filter) ? req.query.filter : "";
      const { users, totalItems, totalPages, currentPage } =
        await this.AdminUseCase.getAllUsers(search, page, limit,filter);
      return res
        .status(200)
        .json({
          success:true,
          message: "Fetched All Users",
          filterData: users,
          totalItems,
          totalPages,
          currentPage,
        });
    } catch (error) {
      return next(error);
    }
  }
  async BlockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, is_block } = req.body;
      const user = await this.AdminUseCase.changeUserStatus(id, is_block);
      return res.status(200).json({
        success: true,
        message: `${user.is_block ? "user Blocked" : "User Unblocked"}`,
        user,
      });
    } catch (error) {
      return next(error);
    }
  }
  async getAllAgencies(req: Request, res: Response, next: NextFunction) {
    try {
      const search = isString(req.query.search) ? req.query.search : "";
      const page = isString(req.query.page) ? parseInt(req.query.page, 10) : 1;
      const limit = isString(req.query.limit)
        ? parseInt(req.query.limit, 10)
        : 8;
        const filter=isString(req.query.filter) ? req.query.filter : "";
      const { agencies, totalItems, totalPages, currentPage } =
        await this.AdminUseCase.getAllAgencies(search, page, limit,filter);
      return res
        .status(200)
        .json({
          success:true,
          message: "Fetch all agencies",
          filterData: agencies,
          totalItems,
          totalPages,
          currentPage,
        });
    } catch (error) {
      return next(error);
    }
  }
  async BlockAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, is_block } = req.body;
      const agent = await this.AdminUseCase.changeAgentStatus(id, is_block);
      return res.status(200).json({
        success: true,
        message: `${agent.is_block ? "user Blocked" : "User Unblocked"}`,
        agent,
      });
    } catch (error) {
      return next(error);
    }
  }
  async getAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.agentid;
      const agent = await this.AdminUseCase.getAgent(id);
      return res
        .status(200)
        .json({ success:true, message: "Fetched Agent Data", agent });
    } catch (error) {
      return next(error);
    }
  }
  async verifyAgentByAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, admin_verified } = req.body;
      const agent = await this.AdminUseCase.adminVerifyAgent(
        id,
        admin_verified
      );
      return res.status(200).json({
        success:true,
        message: `${
          agent.admin_verified == "accept"
            ? "Agency Aceepted"
            : "Agency Rejected"
        }`,
        agent,
      });
    } catch (error) {
      return next(error);
    }
  }
  // async getDashboard(req:Request,res:Response,next:NextFunction){
  //   try {
  //     const users = await this.AdminUseCase.usersData();
  //   } catch (error) {
  //     return next(error);
  //   }
  // }
}
