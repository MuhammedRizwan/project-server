import {Request,Response,Router,NextFunction} from "express"
import { ReviewController } from "../../../../adapters/controllers/review.controller";
import ReviewDependancies from "../../../dependancies/reviewdepencies";

const router = Router();    
const controller = {
    review: new ReviewController(ReviewDependancies)
}
router.get("/:packageId",(req:Request,res:Response,next:NextFunction)=>{
    controller.review.getReviews(req,res,next)
})
router.post("/create-review/:bookingId",(req:Request,res:Response,next:NextFunction)=>{
    controller.review.createReview(req,res,next)
})
router.patch("/edit-review/:reviewId",(req:Request,res:Response,next:NextFunction)=>{
    controller.review.editReview(req,res,next)
})
router.delete("/delete-review/:bookingId/:reviewId",(req:Request,res:Response,next:NextFunction)=>{
    controller.review.deleteReview(req,res,next)
})


export default router