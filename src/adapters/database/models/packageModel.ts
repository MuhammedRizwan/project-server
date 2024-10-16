import { model, Schema } from "mongoose";

const ItinerarySchema = new Schema({
  day: {
    type: Number,
    required: true,
  },
  activities: [
    {
      time: {
        type: String,
      },
      activity: {
        type: String,
      },
    },
  ],
});

const PackageSchema = new Schema(
  {
    travel_agent_id: {
      type: Schema.Types.ObjectId,
      ref: "TravelAgent",
      required: true,
    },
    package_name: { type: String, required: true },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    destinations: [{ type: String, required: true }],
    original_price: { type: Number, required: true },
    offer_price: { type: Number, required: true },
    max_person: { type: Number, required: true },
    no_of_days: { type: Number, required: true },
    no_of_nights: { type: Number, required: true },
    itineraries: [ItinerarySchema],
    images: [{ type: String }],
    is_block: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const packageModel = model("Package", PackageSchema);
export default packageModel;
