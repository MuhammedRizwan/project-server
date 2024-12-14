import walletModel from "../database/models/wallet.model";
import Wallet from "../../domain/entities/wallet/wallet";
import { CustomError } from "../../domain/errors/customError";

interface Transaction {
  bookingId: string;
  amount: number;
  transactionType: "credit" | "debit";
  reason: string;
}
export class WalletRepository {
  async createWallet(userId: string): Promise<void> {
    const newWallet = await walletModel.create({ wallet_user: userId });
  }
  async getWallet(userId: string): Promise<Wallet | null> {
    const wallet: Wallet | null = await walletModel.findOne({
      wallet_user: userId,
    });
    return wallet;
  }
  async refundWallet(
    bookingId: string,
    userId: string,
    amount: number,
    reason: string
  ): Promise<Wallet | null> {
    try {
      const newTransaction: Transaction = {
        bookingId,
        amount,
        transactionType: "credit",
        reason,
      };
      const updatedWallet = await walletModel.findOneAndUpdate(
        { wallet_user: userId },
        {
          $inc: { walletBalance: amount },
          $push: { transaction: newTransaction },
        },
        { new: true }
      );

      if (!updatedWallet) {
        throw new CustomError("Wallet not found for the given user", 404);
      }

      return updatedWallet as unknown as Wallet;
    } catch (error) {
      console.error("Failed to refund wallet:", error);
      throw error;
    }
  }
  async addAdminWallet(
    bookingId: string,
    adminId: string,
    amount: number,
    reason: string
  ): Promise<Wallet | null> {
    const newTransaction: Transaction = {
      bookingId: adminId,
      amount,
      transactionType: "credit",
      reason,
    };
    const newWallet = await walletModel.updateOne(
      { wallet_user: adminId },
      {
        $inc: { walletBalance: amount },
        $push: { transaction: newTransaction },
      },
      {
        new: true,
      }
    );
    return newWallet as unknown as Wallet;
  }
  async debitWallet(
    bookingId: string,
    userId: string | undefined,
    amount: number,
    reason: string
  ): Promise<void> {
    const newTransaction: Transaction = {
      bookingId,
      amount,
      transactionType: "debit",
      reason,
    };
    await walletModel.updateOne(
      { wallet_user: userId },
      {
        $inc: { walletBalance: -amount },
        $push: { transaction: newTransaction },
      }
    );
  }
}
