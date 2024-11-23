import { model, Schema, Types } from "mongoose";

const adminSchema = new Schema(
  {
    _id: { type: Types.ObjectId, default: () => new Types.ObjectId() },
    admin_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);
const adminModel = model("Admin", adminSchema);
export default adminModel;
