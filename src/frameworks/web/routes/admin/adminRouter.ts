import { NextFunction, Request, Response, Router } from "express";
import { adminController } from "../../../../adapters/controllers/adminController";
import AdminDepencies from "../../../dependancies/admindepencies";
import categoryRouter from "../category/categoryRouter";
const router = Router();

const controller = {
  admin: new adminController(AdminDepencies),
};

router.post("/login", (req: Request, res: Response, next: NextFunction) =>
  controller.admin.loginAdmin(req, res, next)
);
router.post("/refreshToken", (req: Request, res: Response) =>
  controller.admin.RefreshAccessToken(req, res)
);
router.get("/users", (req: Request, res: Response, next: NextFunction) =>
  controller.admin.getAllUsers(req, res, next)
);
router.patch("/user/block", (req: Request, res: Response, next: NextFunction) =>
  controller.admin.BlockUser(req, res, next)
);
router.get(
  "/travel-agencies",
  (req: Request, res: Response, next: NextFunction) =>
    controller.admin.getAllAgencies(req, res, next)
);
router.patch(
  "/travel-agencies/block",
  (req: Request, res: Response, next: NextFunction) =>
    controller.admin.BlockAgent(req, res, next)
);
router.get(
  "/travel-agencies/:agentid",
  (req: Request, res: Response, next: NextFunction) =>
    controller.admin.getAgent(req, res, next)
);
router.patch(
  "/travel-agencies/verify",
  (req: Request, res: Response, next: NextFunction) =>
    controller.admin.verifyAgentByAdmin(req, res, next)
);
router.use('/category', categoryRouter);
export default router;
