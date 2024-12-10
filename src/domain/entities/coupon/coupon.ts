
export interface Coupon {
    _id?: string;
    coupon_code: string;
    description: string;
    percentage: string;
    min_amount: string;
    max_amount: string;
    valid_upto: Date;
    is_active: boolean;
    used_by: string[];
}

export interface CouponRepository {
    getCouponById(coupon_id: string | undefined): Promise<Coupon | null>;
    adduserCoupon(
      coupon_id: string | undefined,
      user_id: string
    ): Promise<Coupon | null>;
    createCoupon(coupon: Coupon): Promise<Coupon>;
    getCouponByCode(coupon_code: string): Promise<Coupon | null>;
    getAllCoupons(
      query: object,
      page: number,
      limit: number,
      filterData:object
    ): Promise<Coupon[] | null>;
    editCoupon(coupon_id: string, coupon: Coupon): Promise<Coupon | null>;
    blockCoupon(coupon_id: string, is_active: boolean): Promise<Coupon | null>;
    couponCount(query: object,filterData:object): Promise<number>;
    getUnblockedCoupons(): Promise<Coupon[] | null>;
  }