import Razorpay from "razorpay";
import { CustomError } from "../../domain/errors/customError";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_SECRET_ID,
});
const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZORPAY_SECRET_ID as string;

  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
  return sig;
};

export class RazorPay {
  async createRazorpayOrder(amount: number){
    try {
      const order = await razorpay.orders.create({
        amount,
        currency: "INR",
      });
      if (!order) {
        throw new CustomError("Razorpay order not created", 500);
      }
      return order;
    } catch (error) {
      throw error;
    }
  }
  async verifyRazorpayOrder(
    orderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<string> {
    try {
      const signature = generatedSignature(orderId, razorpayPaymentId);
      if (signature !== razorpaySignature) {
        throw new CustomError("Payment Failed", 400);
      }
      return razorpayPaymentId;
    } catch (error) {
      throw error;
    }
  }
}
