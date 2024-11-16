import { model, Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    lastname:{type:String},
    email: { type: String, unique: true, required: true },
    phone: { type: String},
    address: { type: String},
    profile_picture: { type: String },
    password: { type: String},
    google_authenticated: { type: Boolean, default: false },
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
