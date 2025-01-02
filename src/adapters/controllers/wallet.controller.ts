import { NextFunction, Request, Response } from "express";
import { WalletUseCase } from "../../application/usecases/wallet";
import HttpStatusCode from "../../domain/enum/httpstatus";

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
      const wallet = await this._walletUseCase.getAllWallet(userId);
      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Fetched All Wallet",
        wallet,
      });
    } catch (error) {
      next(error);
    }
  }
  async checkBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId,amount } = req.body;
      console.log(userId,amount)
      const wallet = await this._walletUseCase.checkBalance(userId,amount);
      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Fetched All Wallet",
        wallet,
      });
    } catch (error) {
      next(error);
    }
  }
}
