import { model, Schema } from "mongoose";

const couponSchema = new Schema(
  {
    coupon_code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    percentage: { type: String, required: true },
    min_amount: { type: String, required: true },
    max_amount: { type: String, required: true },
    valid_upto: { type: Date, required: true },
    is_active: { type: Boolean, required: true },
    used_by: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);
const couponModel = model("Coupon", couponSchema);
export default couponModel;
