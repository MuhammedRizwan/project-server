import { NextFunction, Request, Response } from "express";
import { WalletUseCase } from "../../application/usecases/wallet";

interface Dependencies {
  useCase: {
    WalletUseCase: WalletUseCase;
  };
}
export class walletController {
  private _walletUseCase: WalletUseCase;
  constructor(dependencies: Dependencies) {
    this._walletUseCase = dependencies.useCase.WalletUseCase;
  }
  async getAllWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      console.log(userId, "userId");
      const wallet = await this._walletUseCase.getAllWallet(userId);
      return res.status(200).json({
        success: true,
        message: "Fetched All Wallet",
        wallet,
      });
    } catch (error) {
      next(error);
    }
  }
}
