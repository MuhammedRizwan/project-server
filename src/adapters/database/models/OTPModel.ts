import mongoose, { model, Schema } from "mongoose";

const OTPSchema: Schema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  created_at: { type: Date, default: Date.now, expires: "1m" },
});
const OTPModel = model('OTP', OTPSchema);

export default OTPModel;
