import { NextFunction, Request, Response } from "express";
import { UserUseCase } from "../../../application/usecases/user";
import { Iuser } from "../../../domain/entities/user/user";
import { Verification } from "../../../application/usecases/user/userVerification";

interface Dependencies {
  UseCase: {
    UserUseCase: UserUseCase;
    Verification: Verification;
  };
}
export class userController {
  private UserUseCase: UserUseCase;
  private Verification: Verification;
  constructor(dependencies: Dependencies) {
    this.UserUseCase = dependencies.UseCase.UserUseCase;
    this.Verification = dependencies.UseCase.Verification;
  }
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, phone, password } = req.body as Iuser;
      const user = await this.UserUseCase.signupUser({
        username,
        email,
        phone,
        password,
      });
      return res
        .status(201)
        .json({ success:true, message: "User registered ", user });
    } catch (error) {
      return next(error);
    }
  }
  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as Iuser;
      const { user, accessToken, refreshToken } =
        await this.UserUseCase.signinUser(email, password);

      if (!user.is_verified) {
        return res.status(403).json({
          success: false,
          message: "Verify the OTP",
          user,
          redirect: "/verification",
        });
      }
      req['user'] = {userId:user._id as string};

      return res.status(200).json({
        success:true,
        message: "Logged in successfully",
        user,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return next(error);
    }
  }

  async OTPVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp, user } = req.body;
      if (!user) {
        res.status(404).json({ success:false, message: "User Not Found" });
      }
      if (otp.length != 4) {
        res.status(400).json({ success:false, message: "Incorrect OTP" });
      }
      const { userData, accessToken, refreshToken } =
        await this.Verification.OTPVerification(otp, user.email);

      return res.status(200).json({
        success:true,
        message: "OTP  Verified",
        user: userData,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return next(error);
    }
  }
  async sendOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const OTP = await this.Verification.sendOTP(email);
      return res
        .status(200)
        .json({ success:true, message: "Resend OTP", OTP });
    } catch (error) {
      return next(error);
    }
  }
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await this.Verification.changePassword(email, password);
      return res
        .status(200)
        .json({ success:true, message: "Password changed", user });
    } catch (error) {
      return next(error);
    }
  }

  async RefreshAccessToken(req: Request, res: Response) {
    try {
      const accessToken = await this.Verification.refreshAccessToken(
        req.body.refreshToken
      );
      if (!accessToken) {
        return res.json("token expired");
      }
      return res.json({ accessToken: accessToken });
    } catch (error) {
      const err = error as Error;
      return res.status(400).json({ error: err.message });
    }
  }
  async googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, accessToken, refreshToken } =
        (await this.UserUseCase.googleLogin(req.body)) as {
          user: Iuser;
          accessToken: string;
          refreshToken: string;
        };
      return res
        .status(200)
        .json({ success:true,message: "Logged in successfully", user, accessToken, refreshToken });
    } catch (error) {
      return next(error);
    }
  }
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const {userId}=req.params
      const user=await this.UserUseCase.getProfile(userId)
      return res.status(200).json({ success:true,message:"user profile", user });
    } catch (error) {
      next(error)
    }
  }
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const {userId}=req.params
      const user=await this.UserUseCase.updateProfile(userId,req.body)
      return res.status(200).json({success:true,message:"user profile updated", user });
      
    } catch (error) {
      next(error)
    }
  }
  async validatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const {userId} = req.params
      const user=await this.UserUseCase.validatePassword(userId,req.body.oldPassword)
      console.log(user)
      return res.status(200).json({ success:true,message:"password validated", user });
    }catch(error){
      next(error)
    }
  }
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const {userId} = req.params
      const user = await this.UserUseCase.updatePassword(userId,req.body.newPassword)
      return res.status(200).json({ success:true,message:"password updated", user });
    } catch (error) {
      next(error)
    }
  }
}
