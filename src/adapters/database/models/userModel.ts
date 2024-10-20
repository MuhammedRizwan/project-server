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
    is_verified: { type: Boolean, default: false },
    is_block: { type: Boolean, default: false },
    refreshToken: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);
const userModel = model("User", userSchema);
export default userModel;
