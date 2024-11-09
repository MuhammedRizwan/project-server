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
export default router;
