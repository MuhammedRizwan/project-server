import { Request, Response } from "express";
import { UserUseCase } from "../../../application/usecases/user";
import { Iuser } from "../../../domain/entities/user/user";

interface Dependencies {
  UseCase: {
    UserUseCase: UserUseCase;
  };
}
export class userController {
  private UserUseCase: UserUseCase;
  constructor(dependencies: Dependencies) {
    this.UserUseCase = dependencies.UseCase.UserUseCase;
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
      const user = await this.UserUseCase.signinUser(email, password);
      if (!user) {
        res.status(401).send("user not found");
        return;
      }
      res.status(200).json(user);
      return;
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message });
      return;
    }
  }
}
