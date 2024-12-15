export default interface Wallet {
  _id: string;
  wallet_user: string;
  walletBalance: number;
  transaction: {
    bookingId: string;
    date: Date;
    amount: number;
    transactionType: "credit" | "debit";
    reason?: string | null;
  }[];
}

export interface WalletRepository {
  refundWallet(
    bookingId: string,
    userId: string | undefined,
    amount: number,
    reason: string
  ): Promise<Wallet | null>;
  createWallet(user_id: string | undefined): Promise<void>;
  getWallet(user_id: string): Promise<Wallet | null>;
  addAdminWallet(
    bookingId: string,
    adminId: string,
    amount: number,
    reason: string
  ): Promise<Wallet | null>;
  debitWallet(
    bookingId: string,
    userId: string | undefined,
    amount: number,
    reason: string
  ): Promise<void>;
  WalletData(): Promise<
    {
      _id: number; // Month (1-12)
      totalTransactions: number;
    }[]
  >;
  getWalletData(agentId: string): Promise<
    {
      _id: number; // Month (1-12)
      totalTransactions: number;
    }[]
  >;
}
