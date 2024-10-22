import { NextFunction, Request, Response } from "express";
import { CouponUseCase } from "../../../application/usecases/coupon/intex";

interface Dependencies {
  useCase: {
    CouponUseCase: CouponUseCase;
  };
}
const isString = (value: unknown): value is string => typeof value === "string";
export class CouponController {
  private couponuseCase: CouponUseCase;

  constructor(dependencies: Dependencies) {
    this.couponuseCase = dependencies.useCase.CouponUseCase;
  }
  async createCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const coupon = req.body;
      const couponCreated = await this.couponuseCase.createCoupon(coupon);
      return res
        .status(201)
        .json({ status: "success", message: "Coupon Created", couponCreated });
    } catch (error) {
      next(error);
    }
  }
  async getAllCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const search = isString(req.query.search) ? req.query.search : "";
      const page = isString(req.query.page) ? parseInt(req.query.page, 10) : 1;
      const limit = isString(req.query.limit)
        ? parseInt(req.query.limit, 10)
        : 3;
      const { coupons, totalItems, totalPages, currentPage } =
        await this.couponuseCase.getAllCoupons(search, page, limit);
      return res
        .status(200)
        .json({
          status: "success",
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
      const couponEdited = await this.couponuseCase.editCoupon(
        couponId,
        coupon
      );
      return res
        .status(200)
        .json({ status: "success", message: "Coupon Edited", couponEdited });
    } catch (error) {
      next(error);
    }
  }
  async blockCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const couponId = req.params.couponId;
      const { is_active } = req.body;
      const coupons = await this.couponuseCase.blockCoupon(couponId, is_active);
      return res
        .status(200)
        .json({ status: "success", message: "Coupon Blocked", coupons });
    } catch (error) {
      next(error);
    }
  }
}
