import { NextFunction, Request, Response, Router } from "express";
import { BookingController } from "../../../../adapters/controllers/bookingController";
import BookingDepencies from "../../../dependancies/bookingdepencies";
const router = Router();
const controller = {
    booking: new BookingController(BookingDepencies),
}
router.post("/", (req: Request, res: Response, next: NextFunction) =>
    controller.booking.createBooking(req, res, next)
);


export default router;
