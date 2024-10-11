import { model, Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    package_id: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    Date: { type: Date, required: true },
    members: [
      {
        name: {
          type: String,
          required: true,
        },
        age: {
          type: Number,
          required: true,
        },
      },
    ],
    cost:{
        type:Number,
        required:true
    },
    payment_status:{
        type:String,
        enum:['pending','paid','cancelled'],
        required:true
    },
    travel_status:{
        type:String,
        enum:['pending','ongoing','completed','cancelled'],
        required:true
    }
  },
  {
    timestamps: true,
  }
);
const agentModel = model("Booking", bookingSchema);
export default agentModel;
