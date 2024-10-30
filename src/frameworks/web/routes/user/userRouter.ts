import { NextFunction, Request, Response, Router } from "express";
import UserDependancies from "../../../dependancies/userDepencies";
import { userController } from "../../../../adapters/controllers/userController";
import { validateSchema } from "../../../../adapters/middleware/validatorMiddleware";
import userSignupSchema from "../../../../domain/validator/userSignup";
import userLoginSchema from "../../../../domain/validator/userLogin";
import { emailValidationSchema } from "../../../../domain/validator/emailvalidation";
import { passwordValidationSchema } from "../../../../domain/validator/forget-password";
import packageRouter from "../package/packageRouter";
import categoryRouter from "../category/categoryRouter";
import bookingRouter from "../booking/bookingRouter";
import couponRouter from "../coupon/couponRouter";
import jwtAuth from "../../../../adapters/middleware/jwtAuthMiddleware";

const router = Router();

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
router.get('/profile/:userId',jwtAuth,(req:Request,res:Response,next:NextFunction)=>{
  controller.user.getProfile(req,res,next)
})
router.put('/update-profile/:userId',jwtAuth,(req:Request,res:Response,next:NextFunction)=>{
  controller.user.updateProfile(req,res,next)
})
router.post('/validate-password/:userId',jwtAuth,(req:Request,res:Response,next:NextFunction)=>{
  controller.user.validatePassword(req,res,next)
})
router.put('/change-password/:userId',jwtAuth,(req:Request,res:Response,next:NextFunction)=>{
  controller.user.updatePassword(req,res,next)
})
router.use("/packages", packageRouter);
router.use("/categories",categoryRouter);
router.use("/booking",jwtAuth,bookingRouter);
router.use("/coupon",jwtAuth,couponRouter);

export default router;
