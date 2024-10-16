import { Coupon } from "../../../domain/entities/coupon/coupon";
import { CustomError } from "../../../domain/errors/customError";

interface MongoCouponRepository {
  createCoupon(coupon: Coupon): Promise<Coupon>;
  getCouponByCode(coupon_code: string): Promise<Coupon | null>;
  getCouponById(coupon_id: string): Promise<Coupon | null>;
  getAllCoupons(): Promise<Coupon[] | null>;
  editCoupon(coupon_id: string, coupon: Coupon): Promise<Coupon | null>;
  blockCoupon(coupon_id: string, is_active: boolean): Promise<Coupon | null>;
}
interface Dependencies {
  Repositories: {
    MongoCouponRepository: MongoCouponRepository;
  };
}
export class CouponUseCase {
  private couponRepository: MongoCouponRepository;
  constructor(dependencies: Dependencies) {
    this.couponRepository = dependencies.Repositories.MongoCouponRepository;
  }
  async createCoupon(coupon: Coupon): Promise<Coupon> {
    try {
      const createdCoupon = await this.couponRepository.createCoupon(coupon);
      if(!createdCoupon){
        throw new CustomError("coupon not created", 500);
      }
      return createdCoupon;
    } catch (error) {
      throw error;
    }
  }

  async getCouponByCode(coupon_code: string): Promise<Coupon | null> {
    try {
      const coupon = await this.couponRepository.getCouponByCode(coupon_code);
      if (!coupon) {
        throw new CustomError("coupon not found", 404);
      }
      return coupon;
    } catch (error) {
      throw error;
    }
  }
  async getAllCoupons(): Promise<Coupon[] | null> {
    try {
      const coupons = await this.couponRepository.getAllCoupons();
      if (!coupons) {
        throw new CustomError("coupons not found", 404);
      }
      return coupons;
    } catch (error) {
      throw error;
    }
  }

  async getCouponById(coupon_id: string): Promise<Coupon | null> {
    try {
      const coupon = await this.couponRepository.getCouponById(coupon_id);
      if (!coupon) {
        throw new CustomError("coupon not found", 404);
      }
      return coupon;
    } catch (error) {
      throw error;
    }
  }
  async editCoupon(coupon_id: string, coupon: Coupon): Promise<Coupon | null> {
    try {
      const couponData = await this.couponRepository.editCoupon(coupon_id,coupon);
      if (!couponData) {
        throw new CustomError("coupon not found", 404);
      }
      return couponData;
    } catch (error) {
      throw error;
    }
  }
  async blockCoupon(coupon_id: string,is_active: boolean): Promise<Coupon | null> {
    try {
      const couponData = await this.couponRepository.blockCoupon(coupon_id,is_active);
      if (!couponData) {
        throw new CustomError("coupon not found", 404);
      }
      return couponData;
    } catch (error) {
      throw error;
    }
  }
  
}
