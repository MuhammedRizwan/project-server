import { NextFunction, Request, Response, Router } from "express";
import { adminController } from "../../../../adapters/controllers/admin.controller";
import categoryRouter from "./category.router";
import bookingRouter from "./booking.router";
import couponRouter from "./coupon.router";
import jwtAuth from "../../../../adapters/middleware/jwtAuth.middleware";
import Depencies from "../../../dependancies/depencies";

const router = Router();

const controller = {
  admin: new adminController(Depencies),
};

router.post("/login", (req: Request, res: Response, next: NextFunction) =>
  controller.admin.loginAdmin(req, res, next)
);
router.post("/refresh-token", (req: Request, res: Response) =>
  controller.admin.RefreshAccessToken(req, res)
);
router.get(
  "/users",
  jwtAuth,
  (req: Request, res: Response, next: NextFunction) =>
    controller.admin.getAllUsers(req, res, next)
);
router.patch(
  "/user/block",
  jwtAuth,
  (req: Request, res: Response, next: NextFunction) =>
    controller.admin.BlockUser(req, res, next)
);
router.get(
  "/travel-agencies",
  jwtAuth,
  (req: Request, res: Response, next: NextFunction) =>
    controller.admin.getAllAgencies(req, res, next)
);
router.patch(
  "/travel-agencies/block",
  jwtAuth,
  (req: Request, res: Response, next: NextFunction) =>
    controller.admin.BlockAgent(req, res, next)
);
router.get(
  "/travel-agencies/:agentid",
  jwtAuth,
  (req: Request, res: Response, next: NextFunction) =>
    controller.admin.getAgent(req, res, next)
);
router.patch(
  "/travel-agencies/verify",
  jwtAuth,
  (req: Request, res: Response, next: NextFunction) =>
    controller.admin.verifyAgentByAdmin(req, res, next)
);
// router.get('/dashboard', jwtAuth, (req: Request, res: Response, next: NextFunction) => controller.admin.getDashboard(req, res, next))
router.use("/category", jwtAuth, categoryRouter);
router.use("/booking", jwtAuth, bookingRouter);
router.use("/coupon", jwtAuth, couponRouter);
export default router;
