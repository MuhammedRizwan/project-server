import walletModel from "../database/models/walletModel";
import Wallet from "../../domain/entities/wallet/wallet";
import { CustomError } from "../../domain/errors/customError";


interface Transaction {
  amount: number;
  transactionType: "credit" | "debit";
  reason: string;
}
export class WalletRepository {
  async createWallet(userId: string): Promise<void> {
    const newWallet = await walletModel.create({ user_id: userId });
  }
  async getWallet(userId: string): Promise<Wallet | null> {
    const wallet: Wallet | null = await walletModel.findOne({
      user_id: userId,
    });
    return wallet;
  }
  async refundWallet(
    userId: string,
    amount: number,
    reason: string
  ): Promise<Wallet | null> {
    try {
      const newTransaction: Transaction = {
        amount,
        transactionType: "credit",
        reason,
      };
      const updatedWallet = await walletModel.findOneAndUpdate(
        { user_id:userId },
        {
          $inc: { walletBalance: amount },
          $push: { transaction: newTransaction },
        },
        { new: true }
      );

      if (!updatedWallet) {
        throw new CustomError("Wallet not found for the given user",404);
      }

      return {...updatedWallet,_id:updatedWallet._id.toString(),user_id:updatedWallet.user_id.toString()};
    } catch (error) {
      console.error("Failed to refund wallet:", error);
      throw error;
    }
  }
}
