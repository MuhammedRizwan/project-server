import { ObjectId } from "mongoose"

export interface IOTP{
    _id?:ObjectId
    email:string,
    otp:string,
    created_at?:Date
}

export interface OTPRepository {
    createOTP({ email, otp }: { email: string; otp: string }): Promise<IOTP>;
    findOTPbyEmail(email: string): Promise<IOTP | null>;
  }
