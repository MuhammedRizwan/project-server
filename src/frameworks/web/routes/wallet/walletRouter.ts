import { NextFunction, Request, Response, Router } from "express";
import { walletController } from "../../../../adapters/controllers/walletController/intex";
import WalletDepencies from "../../../dependancies/walletdepencies"

const router = Router();

const controller = {
  wallet: new walletController(WalletDepencies),
};

router.get("/:userId", (req: Request, res: Response, next: NextFunction) =>
  controller.wallet.getAllWallet(req, res, next)
);

export default router