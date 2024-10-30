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