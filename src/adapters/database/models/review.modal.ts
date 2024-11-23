import { model, Schema, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    user_id: { type: Types.ObjectId, ref: "User", required: true },
    package_id: { type: Types.ObjectId,ref: "Package", required: true },
    rating: { type: Number, required: true },
    feedback: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const reviewModel = model("Review", reviewSchema);
export default reviewModel;
