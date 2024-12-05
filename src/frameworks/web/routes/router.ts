import { Router } from "express";
import userRouter from "./routers/user.router";
import agentRouter from "./routers/agent.router";
import adminRouter from "./routers/admin.router";

const router = Router();

router.use("/", userRouter);
router.use("/agent", agentRouter);
router.use("/admin", adminRouter);

export default router;
