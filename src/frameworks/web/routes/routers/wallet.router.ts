import { NextFunction, Request, Response, Router } from "express";
import { walletController } from "../../../../adapters/controllers/wallet.controller";
import Depencies from "../../../dependancies/depencies";

const router = Router();

const controller = {
  wallet: new walletController(Depencies),
};

router.get("/:userId", (req: Request, res: Response, next: NextFunction) =>
  controller.wallet.getAllWallet(req, res, next)
);

export default router;
