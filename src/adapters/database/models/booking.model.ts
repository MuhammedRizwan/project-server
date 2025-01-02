import { model, Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    travel_agent_id: {
      type: Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    },
    package_id: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    bill_details: {
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    booking_date: { type: Date, default: Date.now },
    members: [
      {
        name: { type: String, required: true },
        age: { type: Number, required: true },
      },
    ],
    payment_amount: { type: Number, required: true },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      required: true,
    },
    payment_method: {
      type: String,
      enum: ["razorpay", "wallet"],
      required: true,
    },
    payment_id: { type: String },
    booking_status: {
      type: String,
      enum: ["pending", "confirmed", "canceled", "completed"],
      required: true,
    },
    travel_status: {
      type: String,
      enum: ["pending", "ongoing", "completed", "canceled"],
      required: true,
    },
    start_date: { type: Date, required: true },
    coupon_id: { type: Schema.Types.ObjectId, ref: "Coupon" },
    cancellation_reason: { type: String },
    review_id: { type: Schema.Types.ObjectId, ref: "Review" },
  },
  {
    timestamps: true,
  }
);
const bookingModel = model("Booking", bookingSchema);
export default bookingModel;
