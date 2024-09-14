import { Router } from "express";
import userRouter from './user/userRouter'

const router=Router()

router.use('/',userRouter);


export default router