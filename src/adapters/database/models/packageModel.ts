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

const PackageDataSchema = new Schema(
  {
    package_name: {
      type: String,
      required: true,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    destinations: [
      {
        type: String,
        required: true,
      },
    ],
    original_price: {
      type: Number,
      required: true,
    },
    offer_price: {
      type: Number,
      required: true,
    },
    max_person: {
      type: Number,
      required: true,
    },
    no_of_day: {
      type: Number,
      required: true,
    },
    no_of_night: {
      type: Number,
      required: true,
    },
    itineraries: [ItinerarySchema],
    image: [
      {
        type: String,
      },
    ],
    is_block: {
      type: Boolean,
      default: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const PackageSchema = new Schema(
  {
    travel_agent_id: {
      type: Schema.Types.ObjectId,
      ref: "TravelAgent",
      required: true,
    },
    package_data: [PackageDataSchema],
  },
  { timestamps: true }
);

const packageModel = model("Package", PackageSchema);
export default packageModel;
