import { Router } from "express";
import userRouter from "./user/userRouter";
import agentRouter from "./agent/agentRouter";
import adminRouter from "./admin/adminRouter";
import {userBlockedMiddleware} from "../../../adapters/middleware/jwtAuthMiddleware"
import { agentBlockedMiddleware } from "../../../adapters/middleware/jwtAuthMiddleware";


const router = Router();

router.use("/",userBlockedMiddleware, userRouter);
router.use("/agent",agentBlockedMiddleware, agentRouter);
router.use("/admin", adminRouter);

export default router;
