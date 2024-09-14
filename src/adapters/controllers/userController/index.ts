import { Request, Response } from "express";
import { UserUseCase } from "../../../application/usecases/user";
import { Iuser } from "../../../domain/entities/user/user";
import {RefreshToken} from "../../../application/usecases/refreshToken"

interface Dependencies {
  UseCase: {
    UserUseCase: UserUseCase;
    RefreshToken:RefreshToken
  };
}
export class userController {
  private UserUseCase: UserUseCase;
  private RefreshToken:RefreshToken;
  constructor(dependencies: Dependencies) {
    this.UserUseCase = dependencies.UseCase.UserUseCase;
    this.RefreshToken=dependencies.UseCase.RefreshToken;
  }
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, phone, password } = req.body as Iuser;
      const { userDetails, accessToken, refreshToken } =
        await this.UserUseCase.signupUser({ username, email, phone, password });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({ userDetails, accessToken });
      return;
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ error: err.message });
      return;
    }
  }
  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as Iuser;
      const {
        userDetails,accessToken,refreshToken} = await this.UserUseCase.signinUser(email, password);
      if (!userDetails) {
        res.status(401).send("user not found");
        return;
      }
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({userDetails,accessToken});
      return;
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message });
      return;
    }
  }
  async RefreshAccessToken(req: Request, res: Response){
    try {
        const newAccessToken=await this.RefreshToken.refreshAccessToken(req.cookies.refreshToken)
        res.json({accessToken:newAccessToken})
        return
    } catch (error) {
        const err=error as Error
        res.status(400).json({error:err.message})
        return
    }
  }
}
