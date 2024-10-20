import { NextFunction, Request, Response } from "express";
import { AdminUseCase } from "../../../application/usecases/admin";
import { Iadmin } from "../../../domain/entities/admin/admin";

interface Dependencies {
  useCase: {
    AdminUseCase: AdminUseCase;
  };
}

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
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res
        .status(200)
        .json({
          status: "success",
          message: "Admin Logged In",
          admin,
          accessToken,
          refreshToken
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
      console.log(accessToken,"===================================================");
      return res.json({ accessToken });
    } catch (error) {
      const err = error as Error;
      return res.status(400).json({ error: err.message });
    }
  }
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.AdminUseCase.getAllUsers();
      return res
        .status(200)
        .json({ status: "success", message: "Fetched All Users", users });
    } catch (error) {
      return next(error);
    }
  }
  async BlockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, is_block } = req.body;
      const user = await this.AdminUseCase.changeUserStatus(id, is_block);
      return res
        .status(200)
        .json({
          status: "success",
          message: `${user.is_block ? "user Blocked" : "User Unblocked"}`,
          user,
        });
    } catch (error) {
      return next(error);
    }
  }
  async getAllAgencies(req: Request, res: Response, next: NextFunction) {
    try {
      const agencies = await this.AdminUseCase.getAllAgencies();
      return res
        .status(200)
        .json({ status: "success", message: "Fetch all agencies", agencies });
    } catch (error) {
      return next(error);
    }
  }
  async BlockAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, is_block } = req.body;
      const agent = await this.AdminUseCase.changeAgentStatus(id, is_block);
      return res
        .status(200)
        .json({
          status: "success",
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
        .json({ status: "success", message: "Fetched Agent Data", agent });
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
      return res
        .status(200)
        .json({
          status: "success",
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
}
