import mongoose, { model, Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    _id: { type: Types.ObjectId, default: () => new Types.ObjectId() },
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    profile_picture: { type: String },
    password: { type: String, required: true },
    friends: [{ type: Types.ObjectId }],
    is_verifyied: { type: Boolean, default: false },
    is_block: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const userModel = model("User", userSchema);
export default userModel;
