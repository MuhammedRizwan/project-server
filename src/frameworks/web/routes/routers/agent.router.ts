import { NextFunction, Request, Response, Router } from "express";
import { agentController } from "../../../../adapters/controllers/agent.controller";
import AgentDepencies from "../../../dependancies/agentdepencies";
import packageRouter from "./package.router";
import categoryRouter from "./category.router";
import bookingRouter from "./booking.router";
import offerRouter from "./offer.router";

import multer from "multer";
import jwtAuth from "../../../../adapters/middleware/jwtAuth.middleware";
import { agentBlocked } from "../../../../adapters/middleware/block.middleware";



const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const controller = {
  agent: new agentController(AgentDepencies),
};

router.post("/login", (req: Request, res: Response, next: NextFunction) =>
  controller.agent.loginAgent(req, res, next)
);
router.post(
  "/signup",
  upload.single("document"),
  (req: Request, res: Response, next: NextFunction) =>
    controller.agent.createAgent(req, res, next)
);
router.post("/refresh-token", (req: Request, res: Response) =>
  controller.agent.RefreshAccessToken(req, res)
);
router.post(
  "/OTPverification",
  (req: Request, res: Response, next: NextFunction) =>
    controller.agent.OTPVerification(req, res, next)
);
router.post("/sendotp", (req: Request, res: Response, next: NextFunction) =>
  controller.agent.sendOTP(req, res, next)
);
router.post(
  "/changepassword",
  (req: Request, res: Response, next: NextFunction) =>
    controller.agent.changePassword(req, res, next)
);
router.get(
  "/:agentId",
  jwtAuth,
  agentBlocked,
  (req: Request, res: Response, next: NextFunction) => {
    controller.agent.getAgent(req, res, next);
  }
);
router.put(
  "/update/:agentId",
  jwtAuth,
  agentBlocked,
  upload.single("profile_picture"),
  (req: Request, res: Response, next: NextFunction) => {
    controller.agent.updateAgent(req, res, next);
  }
);
router.post(
  "validate-password/:agentId",
  jwtAuth,
  agentBlocked,
  (req: Request, res: Response, next: NextFunction) =>
    controller.agent.validatePassword(req, res, next)
);
router.patch(
  "`/change-password/:agentId",
  jwtAuth,
  agentBlocked,
  (req: Request, res: Response, next: NextFunction) =>
    controller.agent.updatePassword(req, res, next)
);
router.use("/package", jwtAuth, agentBlocked, packageRouter);
router.use("/category", jwtAuth, agentBlocked, categoryRouter);
router.use("/booking", jwtAuth, agentBlocked, bookingRouter);
router.use("/offer", jwtAuth, agentBlocked, offerRouter);
export default router;
