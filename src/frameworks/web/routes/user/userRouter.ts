import { NextFunction, Request, Response, Router } from "express";
import UserDependancies from "../../../dependancies/userDepencies";
import { userController } from "../../../../adapters/controllers/userController";
import { validateSchema } from "../../../../adapters/middleware/validatorMiddleware";
import userSignupSchema from "../../../../domain/validator/userSignup";
import userLoginSchema from "../../../../domain/validator/userLogin";
import { emailValidationSchema } from "../../../../domain/validator/emailvalidation";
import { passwordValidationSchema } from "../../../../domain/validator/forget-password";

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
router.post("/refreshToken", (req: Request, res: Response) => {
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
export default router;
