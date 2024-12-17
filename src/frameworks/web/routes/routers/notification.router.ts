import { NextFunction, Request, Response, Router } from "express";
import Depencies from "../../../dependancies/depencies";
import NotificationController from "../../../../adapters/controllers/notification.controller";

const router = Router();

const controller = {
  notification: new NotificationController(Depencies),
};

router.get("/agent/:agentId", (req: Request, res: Response, next: NextFunction) =>
  controller.notification.getAgentNotifications(req, res, next)
);
router.get("/user/:userId", (req: Request, res: Response, next: NextFunction) =>
  controller.notification.getUserNotifications(req, res, next)
);
router.get("/admin/:adminId", (req: Request, res: Response, next: NextFunction) =>
  controller.notification.getAdminNotifications(req, res, next)
);

export default router;