import { NextFunction, Request, Response, Router } from "express";
import { BookingController } from "../../../../adapters/controllers/booking.controller";
import Depencies from "../../../dependancies/depencies";
import { validateSchema } from "../../../../adapters/middleware/validator.middleware";
import { booking_payload } from "../../../../domain/validator/user-validator";

const router = Router();
const controller = {
  booking: new BookingController(Depencies),
};
router.get("/admin", (req: Request, res: Response, next: NextFunction) =>
  controller.booking.getAdminBookings(req, res, next)
);
router.post("/",validateSchema(booking_payload), (req: Request, res: Response, next: NextFunction) =>
  controller.booking.createBooking(req, res, next)
);
router.get("/:bookingId", (req: Request, res: Response, next: NextFunction) =>
  controller.booking.getBooking(req, res, next)
);
router.get(
  "/travel-agency/:agentId/:packageId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.booking.getAgentBookings(req, res, next)
);
router.post("/createOrder", (req: Request, res: Response, next: NextFunction) =>
  controller.booking.createOrder(req, res, next)
);
router.post("/verifyOrder", (req: Request, res: Response, next: NextFunction) =>
  controller.booking.verifyOrder(req, res, next)
);
router.get(
  "/travel-history/:userId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.booking.getTravelHistory(req, res, next)
);
router.patch(
  "/cancel/:bookingId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.booking.cancelBooking(req, res, next)
);
router.patch(
  "/travel-status/:bookingId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.booking.changeTravelStatus(req, res, next)
);
router.patch(
  "/booking-status/:bookingId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.booking.changeStatus(req, res, next)
);
router.get(
  "/travel-completed/:userId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.booking.completedTravel(req, res, next)
);
router.get(
  "/new-bookings/:agentId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.booking.getNewBooking(req, res, next)
);
export default router;
