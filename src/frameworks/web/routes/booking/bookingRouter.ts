import { NextFunction, Request, Response, Router } from "express";
import { BookingController } from "../../../../adapters/controllers/bookingController";
import BookingDepencies from "../../../dependancies/bookingdepencies";
const router = Router();
const controller = {
  booking: new BookingController(BookingDepencies),
};
router.get("/admin", (req: Request, res: Response, next: NextFunction) =>
  controller.booking.getAdminBookings(req, res, next)
);
router.post("/", (req: Request, res: Response, next: NextFunction) =>
  controller.booking.createBooking(req, res, next)
);
router.get("/:bookingId", (req: Request, res: Response, next: NextFunction) =>
  controller.booking.getBooking(req, res, next)
);
router.get(
  "/travel-agency/:agentId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.booking.getAgentBookings(req, res, next)
);

export default router;
