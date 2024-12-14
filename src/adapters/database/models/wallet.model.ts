import { model, Schema } from "mongoose";

const walletSchema = new Schema(
  {
    wallet_user: { type: Schema.Types.ObjectId, required: true },
    walletBalance: { type: Number, default: 0 },
    transaction: [
      {
        amount: { type: Number, required: true },
        bookingId: { type: Schema.Types.ObjectId, required: true ,ref:"Booking"},
        reason: { type: String },
        transactionType: {
          type: String,
          enum: ["credit", "debit"],
          required: true,
        },
        date: { type: Date, default: new Date() },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const walletModel = model("Wallet", walletSchema);
export default walletModel;
