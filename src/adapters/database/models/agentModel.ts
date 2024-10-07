import  { model, Schema, Types } from "mongoose";

const agentSchema = new Schema(
  {
    _id: { type: Types.ObjectId, default: () => new Types.ObjectId() },
    agency_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    location:{type:String,required:true},
    profile_picture: { type: String },
    password: { type: String, required: true },
    DocumentURL:{type:String,required:true},
    is_verified: { type: Boolean, default: false },
    admin_verified: {
      type: String,
      enum: ["pending", "accept", "reject"],
      default: "pending",
    },
    is_block: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const agentModel = model("Agent", agentSchema);
export default agentModel;