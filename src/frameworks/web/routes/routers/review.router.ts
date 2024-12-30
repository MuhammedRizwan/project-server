import {Request,Response,Router,NextFunction} from "express"
import { ReviewController } from "../../../../adapters/controllers/review.controller";
import Depencies from "../../../dependancies/depencies";
import jwtAuth from "../../../../adapters/middleware/jwtAuth.middleware";


const router = Router();    
const controller = {
    review: new ReviewController(Depencies)
}
router.get("/:packageId",(req:Request,res:Response,next:NextFunction)=>{
    controller.review.getReviews(req,res,next)
})
router.post("/create-review/:bookingId",jwtAuth,(req:Request,res:Response,next:NextFunction)=>{
    controller.review.createReview(req,res,next)
})
router.patch("/edit-review/:reviewId",jwtAuth,(req:Request,res:Response,next:NextFunction)=>{
    controller.review.editReview(req,res,next)
})
router.delete("/delete-review/:bookingId/:reviewId",jwtAuth,(req:Request,res:Response,next:NextFunction)=>{
    controller.review.deleteReview(req,res,next)
})


export default router