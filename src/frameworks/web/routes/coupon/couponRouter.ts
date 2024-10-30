import {Request,Response,Router,NextFunction} from "express"
import { CouponController } from "../../../../adapters/controllers/couponController/intex";
import CouponDependancies from "../../../dependancies/coupondepencies";


const router = Router();    
const controller = {
    coupon: new CouponController(CouponDependancies)
}
router.get("/",(req:Request,res:Response,next:NextFunction)=>{
    controller.coupon.getAllCoupons(req,res,next)
})
router.post("/create",(req:Request,res:Response,next:NextFunction)=>{
    controller.coupon.createCoupon(req,res,next)
})
router.put("/edit/:couponId",(req:Request,res:Response,next:NextFunction)=>
    controller.coupon.editCoupon(req,res,next))
router.patch("/block/:couponId",(req:Request,res:Response,next:NextFunction)=>
    controller.coupon.blockCoupon(req,res,next))
router.get("/unblocked",(req:Request,res:Response,next:NextFunction)=>
    controller.coupon.getUnblockedCoupons(req,res,next))
router.post("/used/:couponId",(req:Request,res:Response,next:NextFunction)=>
    controller.coupon.getUsedCoupons(req,res,next))
export default router