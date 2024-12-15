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
  async WalletData() {
    try {
      const year = new Date().getFullYear();
      const walletTransactions = await walletModel.aggregate([
        {
          $unwind: "$transaction",
        },
        {
          $match: {
            "transaction.transactionType": "credit",
            "transaction.date": {
              $gte: new Date(`${year}-01-01T00:00:00.000Z`),
              $lte: new Date(`${year}-12-31T23:59:59.999Z`),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$transaction.date" },
            totalTransactions: { $sum: "$transaction.amount" },
          },
        },
      ]);
      return walletTransactions;
    } catch (error) {
      throw error;
    }
  }
  async getWalletData(agentId: string): Promise<
    {
      _id: number; // Month (1-12)
      totalTransactions: number;
    }[]
  > {
    try {
      const year = new Date().getFullYear();
      const walletTransactions = await walletModel.aggregate([
        {
          $unwind: "$transaction",
        },
        {
          $match: {
            wallet_user: agentId,
            "transaction.transactionType": "credit",
            "transaction.date": {
              $gte: new Date(`${year}-01-01T00:00:00.000Z`),
              $lte: new Date(`${year}-12-31T23:59:59.999Z`),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$transaction.date" },
            totalTransactions: { $sum: "$transaction.amount" },
          },
        },
      ]);
      return walletTransactions;
    } catch (error) {
      throw error;
    }
  }
}
