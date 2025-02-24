import Razorpay from "razorpay";
import { CustomError } from "../../domain/errors/customError";
import crypto from "crypto";
import HttpStatusCode from "../../domain/enum/httpstatus";
import configKeys from "../../config";

const razorpay = new Razorpay({
  key_id:configKeys.RAZORPAY_KEYID,
  key_secret:configKeys.RAZORPAY_SECRETKEY
});
const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = configKeys.RAZORPAY_SECRETKEY

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
        throw new CustomError("Razorpay order not created", HttpStatusCode.INTERNAL_SERVER_ERROR);
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
        throw new CustomError("Payment Failed", HttpStatusCode.BAD_REQUEST);
      }
      return razorpayPaymentId;
    } catch (error) {
      throw error;
    }
  }
}
