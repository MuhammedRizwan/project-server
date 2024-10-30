import { model, Schema } from "mongoose";

const walletSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    walletBalance: { type: Number, default: 0 },
    transaction: [
      {
        amount: { type: Number, required: true },
        reason: { type: String },
        transactionType: {
          type: String,
          enum: ["credit", "debit"],
          required: true,
        },
        date: { type: String, default: Date.now() },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const walletModel = model("Wallet", walletSchema);
export default walletModel;
