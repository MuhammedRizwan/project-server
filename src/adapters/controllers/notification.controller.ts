import { NextFunction, Request, Response } from "express";
import NotificationUseCase from "../../application/usecases/notification";
import HttpStatusCode from "../../domain/enum/httpstatus";

interface Depencies {
  useCase: {
    NotificationUseCase: NotificationUseCase;
  };
}

export default class NotificationController {
  private _NotificationUseCase: NotificationUseCase;
  constructor(dependencies: Depencies) {
    this._NotificationUseCase = dependencies.useCase.NotificationUseCase;
  }
  async getAgentNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const { agentId } = req.params;
      const notifications = await this._NotificationUseCase.getAgentNotifications(
        agentId
      );
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, message: "success", notifications });
    } catch (error) {
      next(error);
    }
  }
  async getUserNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const notifications = await this._NotificationUseCase.getAgentNotifications(
        userId
      );
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, message: "success", notifications });
    } catch (error) {
      next(error);
    }
  }
  async getAdminNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const notifications = await this._NotificationUseCase.getAdminNotifications(
        adminId
      );
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, message: "success", notifications });
    } catch (error) {
      next(error);
    }
  }
}
