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
}
