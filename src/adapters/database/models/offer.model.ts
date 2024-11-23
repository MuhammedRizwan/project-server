import { model, Schema } from "mongoose";

const offerSchema = new Schema(
  {
    agent_id: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
    offer_name: { type: String, required: true },
    description: { type: String, required: true },
    package_id: [{ type: Schema.Types.ObjectId, ref: "Package" }],
    image: { type: String, required: true },
    percentage: { type: Number, required: true },
    max_offer: { type: Number, required: true },
    is_active: { type: Boolean,required: true },
    valid_from: { type: Date, required: true },
    valid_upto: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const offerModel = model("Offer", offerSchema);
export default offerModel;
