import { NextFunction, Request, Response } from "express";
import { CouponUseCase } from "../../application/usecases/coupon/intex";
import HttpStatusCode from "../../domain/enum/httpstatus";

interface Dependencies {
  useCase: {
    CouponUseCase: CouponUseCase;
  };
}
const isString = (value: unknown): value is string => typeof value === "string";
export class CouponController {
  private _couponuseCase: CouponUseCase;

  constructor(dependencies: Dependencies) {
    this._couponuseCase = dependencies.useCase.CouponUseCase;
  }
  async createCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const coupon = req.body;
      const couponData = await this._couponuseCase.createCoupon(coupon);
      return res
        .status(HttpStatusCode.CREATED)
        .json({ success:true, message: "Coupon Created", couponData });
    } catch (error) {
      next(error);
    }
  }
  async getAllCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const search = isString(req.query.search) ? req.query.search : "";
      const page = isString(req.query.page) ? parseInt(req.query.page, 8) : 1;
      const limit = isString(req.query.limit)
        ? parseInt(req.query.limit, 8)
        : 3;
        const filter=isString(req.query.filter) ? req.query.filter : "";
      const { coupons, totalItems, totalPages, currentPage } =
        await this._couponuseCase.getAllCoupons(search, page, limit,filter);
      return res.status(HttpStatusCode.OK).json({
        success:true,
        message: "All coupons",
        filterData: coupons,
        totalItems,
        totalPages,
        currentPage,
      });
    } catch (error) {
      next(error);
    }
  }
  async editCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const coupon = req.body;
      const couponId = req.params.couponId;
      const couponData = await this._couponuseCase.editCoupon(
        couponId,
        coupon
      );
      return res
        .status(HttpStatusCode.OK)
        .json({ success:true, message: "Coupon Edited", couponData });
    } catch (error) {
      next(error);
    }
  }
  async blockCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const {couponId} = req.params;
      const { is_active } = req.body;
      const coupons = await this._couponuseCase.blockCoupon(couponId, is_active);
      return res
        .status(HttpStatusCode.OK)
        .json({ success:true, message: "Coupon Blocked", coupons });
    } catch (error) {
      next(error);
    }
  }
  async getUnblockedCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const coupons = await this._couponuseCase.getUnblockedCoupons();
      return res
        .status(HttpStatusCode.OK)
        .json({ success:true, message: "Unblocked coupons", coupons });
    } catch (error) {
      next(error);
    }
  }
  async getUsedCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const couponId = req.params.couponId;
      const {userId,totalPrice} = req.body;
      const discountAmount = await this._couponuseCase.getUsedCoupons(
        couponId,
        userId,
        totalPrice
      );
      return res
        .status(HttpStatusCode.OK)
        .json({ success:true, message: "coupon validated", discountAmount });
    } catch (error) {
      next(error);
    }
  }
}
