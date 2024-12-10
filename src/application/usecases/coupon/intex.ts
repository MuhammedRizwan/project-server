import { Coupon, CouponRepository } from "../../../domain/entities/coupon/coupon";
import { CustomError } from "../../../domain/errors/customError";


interface Dependencies {
  Repositories: {
    CouponRepository: CouponRepository;
  };
}
export class CouponUseCase {
  private couponRepository: CouponRepository;
  constructor(dependencies: Dependencies) {
    this.couponRepository = dependencies.Repositories.CouponRepository;
  }
  async createCoupon(coupon: Coupon): Promise<Coupon> {
    try {
      const couponExists = await this.couponRepository.getCouponByCode(
        coupon.coupon_code
      )
      if(couponExists) {
        throw new CustomError("coupon already exists", 409)
      }
      const createdCoupon = await this.couponRepository.createCoupon(coupon);
      if (!createdCoupon) {
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
  async getAllCoupons(search: string, page: number, limit: number,filter:string) {
    try {
      const query = search
        ? { coupon_code: { $regex: search, $options: "i" } }
        : {};
        const filterData =filter === "all"? {}: {  is_active: filter === "blocked" ? false : true };
      const coupons = await this.couponRepository.getAllCoupons(
        query,
        page,
        limit,
        filterData
      );
      if (!coupons) {
        throw new CustomError("coupons not found", 404);
      }
      const totalItems = await this.couponRepository.couponCount(query,filterData);
      if (totalItems === 0) {
        throw new CustomError("coupons not found", 404);
      }

      return {
        coupons,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      };
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
      const couponData = await this.couponRepository.editCoupon(
        coupon_id,
        coupon
      );
      if (!couponData) {
        throw new CustomError("coupon not found", 404);
      }
      return couponData;
    } catch (error) {
      throw error;
    }
  }
  async blockCoupon(
    coupon_id: string,
    is_active: boolean
  ): Promise<Coupon | null> {
    try {
      const couponData = await this.couponRepository.blockCoupon(
        coupon_id,
        is_active
      );
      if (!couponData) {
        throw new CustomError("coupon not found", 404);
      }
      return couponData;
    } catch (error) {
      throw error;
    }
  }
  async getUnblockedCoupons(): Promise<Coupon[] | null> {
    try {
      const coupons = await this.couponRepository.getUnblockedCoupons();
      if (!coupons) {
        throw new CustomError("coupons not found", 404);
      }
      return coupons;
    } catch (error) {
      throw error;
    }
  }
  async getUsedCoupons(coupon_id: string, user_id: string, totalPrice: number) {
    try {
      const coupon = await this.couponRepository.getCouponById(coupon_id);
      if (!coupon) {
        throw new CustomError("coupon not found", 404);
      }
      if (coupon.valid_upto) {
        const currentDate = new Date();
        const valid_upto = new Date(coupon.valid_upto);
        if (currentDate > valid_upto) {
          throw new CustomError("coupon expired", 404);
        }
        if (coupon.used_by.includes(user_id)) {
          throw new CustomError("coupon already used", 404);
        }
        if (Number(coupon.min_amount) > totalPrice) {
          throw new CustomError("coupon min amount not reached", 404);
        }
        let discountAmount = (totalPrice * Number(coupon.percentage)) / 100;
        if (discountAmount > Number(coupon.max_amount)) {
          discountAmount = Number(coupon.max_amount);
        }
        return discountAmount;
      }
    } catch (error) {
      throw error;
    }
  }
}
