import { FilterQuery, Types } from "mongoose";
import { Coupon } from "../../domain/entities/coupon/coupon";
import { CustomError } from "../../domain/errors/customError";
import couponModel from "../database/models/couponModel";

export class MongoCouponRepository {
  async createCoupon(coupon: Coupon): Promise<Coupon> {
    const couponData: Coupon = (
      await couponModel.create(coupon)
    ).toObject() as unknown as Coupon;
    return couponData;
  }
  async getAllCoupons(query: FilterQuery<Coupon>,page: number,limit: number): Promise<Coupon[] | null> {
    try {
      const coupons = await couponModel.find(query).skip((page - 1) * limit).limit(limit);
      if (!coupons) {
        throw new CustomError("Coupons not found", 404);
      }
      return coupons.map((coupon) => ({...coupon.toObject(),_id: coupon._id.toString(), used_by: coupon.used_by.map((id: Types.ObjectId) => id.toString()), }));
    } catch (error) {
      throw new CustomError("Failed to get coupons", 500);
    }
  }
  async couponCount(query: FilterQuery<Coupon>): Promise<number> {
    return couponModel.countDocuments(query);
  }
  async getCouponByCode(coupon_code: string): Promise<Coupon | null> {
    const coupon: Coupon | null = await couponModel.findOne({ coupon_code });
    return coupon;
  }
  async getCouponById(coupon_id: string): Promise<Coupon | null> {
    const coupon: Coupon | null = await couponModel.findById(coupon_id);
    return coupon;
  }
  async editCoupon(coupon_id: string, coupon: Coupon): Promise<Coupon | null> {
    const updatedCoupon: Coupon | null = await couponModel.findByIdAndUpdate(
      coupon_id,
      coupon,
      { new: true }
    );
    if (!updatedCoupon) {
      throw new CustomError(`Coupon with ID ${coupon_id} not found.`, 404);
    }
    return updatedCoupon;
  }
  async blockCoupon(
    coupon_id: string,
    is_active: boolean
  ): Promise<Coupon | null> {
    try {
      const updatedCoupon: Coupon | null = await couponModel.findByIdAndUpdate(
        coupon_id,
        { is_active },
        { new: true }
      );
      if (!updatedCoupon) {
        throw new CustomError(`Coupon with ID ${coupon_id} not found.`, 404);
      }

      return updatedCoupon;
    } catch (error) {
      throw new CustomError("Failed to update coupon", 500);
    }
  }
  async getUnblockedCoupons(): Promise<Coupon[] | null> {
    try {
      const coupons: Coupon[] = await couponModel.find({ is_active: true });  
      return coupons;
    } catch (error) {
      throw error;
    }
  }
}
