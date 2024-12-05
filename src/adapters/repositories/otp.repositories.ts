import { ObjectId } from "mongoose";
import { IOTP } from "../../domain/entities/user/otp";
import OTPModel from "../database/models/otp.model";

export class OTPRepository {
  async createOTP(otpData: IOTP):Promise<IOTP>{
    const createOTP=await OTPModel.create(otpData)
    if(createOTP){
      const Otp: IOTP = {
        ...createOTP.toObject() as unknown as IOTP,  
        _id: createOTP._id as ObjectId,
      };
      return Otp
    }
    return createOTP
  }
  async findOTPbyEmail(email: string):Promise<IOTP|null>{
    const otpData = await OTPModel.findOne({ email }).sort({ created_at: -1 });
    if(otpData){
      const Otp: IOTP = {
        ...otpData.toObject() as unknown as IOTP,  
        _id: otpData._id as ObjectId,
      };
      return Otp
    }
      return otpData;
  }
}
