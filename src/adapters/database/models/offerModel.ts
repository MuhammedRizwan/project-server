import { model, Schema } from "mongoose";

const offerSchema = new Schema(
  {
    offer_name: { type: String, required: true },
    description: { type: String, required: true },
    package_id: [{ type: Schema.Types.ObjectId, ref: "Package" }],
    Percent: { type: Number, required: true },
    max_discount: { type: Number, required: true },
    is_active: { type: Boolean, default: true },
    valid_from: { type: Date, required: true },
    valid_upto: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const offerModel = model("Offer", offerSchema);
export default offerModel;
