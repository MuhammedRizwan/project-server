import { Router } from "express";
import userRouter from "./user/userRouter";
import agentRouter from "./agent/agentRouter";
import adminRouter from "./admin/adminRouter";

const router = Router();

router.use("/", userRouter);
router.use("/agent", agentRouter);
router.use("/admin", adminRouter);

export default router;
