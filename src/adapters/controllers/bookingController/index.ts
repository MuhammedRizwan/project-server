import { NextFunction, Request, Response } from "express";
import { BookingUseCase } from "../../../application/usecases/booking";

interface Dependencies {
  useCase: {
    BookingUseCase: BookingUseCase;
  };
}

export class BookingController {
  private bookingUseCase: BookingUseCase;
  constructor(dependencies: Dependencies) {
    this.bookingUseCase = dependencies.useCase.BookingUseCase;
  }
  async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("req.body", req.body);
      const booking = await this.bookingUseCase.createBooking(req.body);
      return res
        .status(201)
        .json({ status: "success", message: "Booking Created", booking });
    } catch (error) {
      next(error);
    }
  }
  async getBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId } = req.params;
      const booking = await this.bookingUseCase.getBooking(bookingId);
      return res
        .status(200)
        .json({ status: "success", message: "Fetched Booking", booking });
    } catch (error) {
      next(error);
    }
  }
  async getAgentBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const { agentId } = req.params;
      const bookings = await this.bookingUseCase.getAgentBookings(agentId);
      return res
        .status(200)
        .json({ status: "success", message: "Fetched All Bookings", bookings });
    } catch (error) {
      next(error);
    }
  }
  async getAdminBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const bookings = await this.bookingUseCase.getAdminBookings();
      return res
        .status(200)
        .json({ status: "success", message: "Fetched All Bookings", bookings });
    } catch (error) {
      next(error);
    }
  }
}
