import { NextFunction, Request, Response } from "express";
import { CouponUseCase } from "../../../application/usecases/coupon/intex";

interface Dependencies {
    useCase:{
        CouponUseCase:CouponUseCase
    }
}
export class CouponController {
    private couponuseCase: CouponUseCase;

    constructor(dependencies: Dependencies) {
        this.couponuseCase = dependencies.useCase.CouponUseCase
    }
    async createCoupon(req:Request, res:Response, next:NextFunction) {
        try {
            const coupon = req.body;
            const couponCreated = await this.couponuseCase.createCoupon(coupon);
            return res.status(201).json({status:"success",message:"Coupon Created",couponCreated});
        } catch (error) {
            next(error);
        }
    }
    async getAllCoupons(req:Request, res:Response, next:NextFunction) {
        try {
            const coupons = await this.couponuseCase.getAllCoupons();
            return res.status(200).json({status:"success",message:"All coupons",coupons});
        } catch (error) {
            throw error;
        }
    }
    async editCoupon(req:Request, res:Response, next:NextFunction) {
        try {
            const coupon = req.body;
            const couponId = req.params.couponId;
            const couponEdited = await this.couponuseCase.editCoupon(couponId,coupon);
            return res.status(200).json({status:"success",message:"Coupon Edited",couponEdited});
        } catch (error) {
            throw error;
        }
    }
    async blockCoupon(req:Request, res:Response, next:NextFunction) {
        try {
            const couponId = req.params.couponId;
            const{is_active}  = req.body;
            const coupons = await this.couponuseCase.blockCoupon(couponId,is_active);
            return res.status(200).json({status:"success",message:"Coupon Blocked",coupons});
        } catch (error) {
            throw error;
        }
    }
}