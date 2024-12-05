import { NextFunction, Request, Response, Router } from "express";
import UserDependancies from "../../../dependancies/userDepencies";

import userSignupSchema from "../../../../domain/validator/userSignup";
import userLoginSchema from "../../../../domain/validator/userLogin";
import { emailValidationSchema } from "../../../../domain/validator/emailvalidation";
import { passwordValidationSchema } from "../../../../domain/validator/forget-password";
import packageRouter from "./package.router";
import categoryRouter from "./category.router";
import bookingRouter from "./booking.router";
import couponRouter from "./coupon.router";
import reviewRouter from "./review.router";
import postRouter from "./post.router";
import walletRouter from "./wallet.router";
import chatRouter from "./chat.router";
import multer from "multer";
import jwtAuth from "../../../../adapters/middleware/jwtAuth.middleware";
import { userBlocked } from "../../../../adapters/middleware/block.middleware";
import { userController } from "../../../../adapters/controllers/user.controller";
import { validateSchema } from "../../../../adapters/middleware/validator.middleware";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const controller = {
  user: new userController(UserDependancies),
};

router.post(
  "/signup",
  validateSchema(userSignupSchema),
  (req: Request, res: Response, next: NextFunction) =>
    controller.user.createUser(req, res, next)
);
router.post(
  "/login",
  validateSchema(userLoginSchema),
  (req: Request, res: Response, next: NextFunction) => {
    controller.user.loginUser(req, res, next);
  }
);
router.post("/refresh-token", (req: Request, res: Response) => {
  controller.user.RefreshAccessToken(req, res);
});
router.post(
  "/OTPverification",
  (req: Request, res: Response, next: NextFunction) => {
    controller.user.OTPVerification(req, res, next);
  }
);
router.post(
  "/sendotp",
  validateSchema(emailValidationSchema),
  (req: Request, res: Response, next: NextFunction) => {
    controller.user.sendOTP(req, res, next);
  }
);
router.post(
  "/changepassword",
  validateSchema(passwordValidationSchema),
  (req: Request, res: Response, next: NextFunction) => {
    controller.user.changePassword(req, res, next);
  }
);
router.post('/googleLogin',(req:Request,res:Response,next:NextFunction)=>{
  controller.user.googleLogin(req,res,next)
})
router.get('/profile/:userId',jwtAuth,userBlocked,(req:Request,res:Response,next:NextFunction)=>{
  controller.user.getProfile(req,res,next)
})
router.put('/update-profile/:userId',jwtAuth,userBlocked,upload.single('profile_picture'),(req:Request,res:Response,next:NextFunction)=>{
  controller.user.updateProfile(req,res,next)
})
router.post('/validate-password/:userId',jwtAuth,userBlocked,(req:Request,res:Response,next:NextFunction)=>{
  controller.user.validatePassword(req,res,next)
})
router.put('/change-password/:userId',jwtAuth,userBlocked,(req:Request,res:Response,next:NextFunction)=>{
  controller.user.updatePassword(req,res,next)
})
router.use("/packages",jwtAuth,userBlocked,packageRouter);
router.use("/category",jwtAuth,userBlocked,categoryRouter);
router.use("/booking",jwtAuth,userBlocked,bookingRouter);
router.use("/coupon",jwtAuth,userBlocked,couponRouter);
router.use("/wallet",jwtAuth,userBlocked,walletRouter);
router.use("/review",jwtAuth,userBlocked,reviewRouter);
router.use("/post",jwtAuth,userBlocked,postRouter);
router.use("/chat",jwtAuth,userBlocked,chatRouter);

export default router;
