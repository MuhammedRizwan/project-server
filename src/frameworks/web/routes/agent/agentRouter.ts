import { NextFunction, Request, Response, Router } from "express";
import { agentController } from "../../../../adapters/controllers/agentController";
import AgentDepencies from "../../../dependancies/agentdepencies";
import packageRouter from "../package/packageRouter";
import categoryRouter from "../category/categoryRouter";
import bookingRouter from "../booking/bookingRouter"

import multer from "multer";
import jwtAuth from "../../../../adapters/middleware/jwtAuthMiddleware";

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
router.use('/package',jwtAuth, packageRouter);
router.use('/category',jwtAuth, categoryRouter);
router.use('/booking',jwtAuth,bookingRouter)
export default router;
