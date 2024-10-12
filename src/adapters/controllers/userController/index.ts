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
        .json({ status: "success", message: "User registered ", user });
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
          status: "error",
          message: "Verify the OTP",
          user,
          redirect: "/verification",
        });
      }

      return res.status(200).json({
        status: "success",
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
      const { Otp, user } = req.body;
      if (!user) {
        res.status(404).json({ status: "error", message: "User Not Found" });
      }
      if (Otp.length != 4) {
        res.status(400).json({ status: "error", message: "Incorrect OTP" });
      }
      const { userData, accessToken, refreshToken } =
        await this.Verification.OTPVerification(Otp, user.email);

      return res.status(200).json({
        status: "success",
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
      const OTPData = await this.Verification.sendOTP(email);
      return res
        .status(200)
        .json({ status: "success", message: "Resend OTP", OTPData });
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
        .json({ status: "success", message: "Password changed", user });
    } catch (error) {
      return next(error);
    }
  }

  async RefreshAccessToken(req: Request, res: Response) {
    try {
      const accessToken = await this.Verification.refreshAccessToken(
        req.cookies.refreshToken
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
        .json({ status: "success", user, accessToken, refreshToken });
    } catch (error) {
      return next(error);
    }
  }
}
