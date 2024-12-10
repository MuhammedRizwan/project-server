export default interface Wallet {
    _id: string; 
    user_id: string;
    walletBalance: number;
    transaction: {
      date: string;
      amount: number;
      transactionType: "credit" | "debit";
      reason?: string|null;
    }[];
  }

  export interface WalletRepository {
    refundWallet(
      userId: string | undefined,
      amount: number,
      reason: string
    ): Promise<Wallet | null>;
    createWallet(user_id:string|undefined): Promise<void>;
    getWallet(user_id:string): Promise<Wallet|null>;
}