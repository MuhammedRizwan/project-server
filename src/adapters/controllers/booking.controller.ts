import { NextFunction, Request, Response } from "express";
import { BookingUseCase } from "../../application/usecases/booking";
import HttpStatusCode from "../../domain/enum/httpstatus";

interface Dependencies {
  useCase: {
    BookingUseCase: BookingUseCase;
  };
}
const isString = (value: unknown): value is string => typeof value === "string";
export class BookingController {
  private _bookingUseCase: BookingUseCase;
  constructor(dependencies: Dependencies) {
    this._bookingUseCase = dependencies.useCase.BookingUseCase;
  }
  async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await this._bookingUseCase.createBooking(req.body);
      return res
        .status(HttpStatusCode.CREATED)
        .json({ success: true, message: "Booking Created", booking });
    } catch (error) {
      next(error);
    }
  }
  async getBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId } = req.params;
      const booking = await this._bookingUseCase.getBooking(bookingId);
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, message: "Fetched Booking", booking });
    } catch (error) {
      next(error);
    }
  }
  async getAgentBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const search = isString(req.query.search) ? req.query.search : "";
      const page = isString(req.query.page) ? parseInt(req.query.page, 10) : 1;
      const limit = isString(req.query.limit)
        ? parseInt(req.query.limit, 10)
        : 3;
      const { agentId, packageId } = req.params;
      const { bookingData, totalItems, totalPages, currentPage } =
        await this._bookingUseCase.getAgentBookings(
          agentId,
          packageId,
          search,
          page,
          limit
        );
      return res
        .status(HttpStatusCode.OK)
        .json({
          success: true,
          message: "Fetched All Bookings",
          bookingData,
          totalItems,
          totalPages,
          currentPage,
        });
    } catch (error) {
      next(error);
    }
  }
  async getAdminBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const search = isString(req.query.search) ? req.query.search : "";
      const page = isString(req.query.page) ? parseInt(req.query.page, 10) : 1;
      const limit = isString(req.query.limit)
        ? parseInt(req.query.limit, 10)
        : 8;

      const { bookingData, totalItems, totalPages, currentPage } =
        await this._bookingUseCase.getAdminBookings(search, page, limit);
      return res
        .status(HttpStatusCode.OK)
        .json({
          status: "success",
          message: "Fetched All Bookings",
          filterData: bookingData,
          totalItems,
          totalPages,
          currentPage,
        });
    } catch (error) {
      next(error);
    }
  }
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount } = req.body;
      const order = await this._bookingUseCase.createRazorpayOrder(amount);
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, message: "razorpay Created", order });
    } catch (error) {
      next(error);
    }
  }
  async verifyOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId, razorpayPaymentId, razorpaySignature } = req.body;
      const successpayment = await this._bookingUseCase.verifyRazorpayOrder(
        orderId,
        razorpayPaymentId,
        razorpaySignature
      );
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, message: "payment verified", successpayment });
    } catch (error) {
      next(error);
    }
  }
  async getTravelHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const travelHistory = await this._bookingUseCase.getTravelHistory(userId);
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, message: "user travel history", travelHistory });
    } catch (error) {
      next(error);
    }
  }
  async cancelBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId } = req.params;
      const { cancellation_reason } = req.body;
      const cancelBooking = await this._bookingUseCase.cancelBooking(
        bookingId,
        cancellation_reason
      );
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, message: "booking canceled", cancelBooking });
    } catch (error) {
      next(error);
    }
  }
  async changeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId } = req.params;
      const { status, cancellation_reason } = req.body;
      const changeBookingstatus =
        await this._bookingUseCase.changeBookingStatus(
          bookingId,
          status,
          cancellation_reason
        );
      return res
        .status(HttpStatusCode.OK)
        .json({
          success: true,
          message: "booking status updated",
          changeBookingstatus,
        });
    } catch (error) {
      next(error);
    }
  }
  async changeTravelStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId } = req.params;
      const { travel_status } = req.body;
      const changeTravelstatus = await this._bookingUseCase.changeTravelStatus(
        bookingId,
        travel_status
      );
      return res
        .status(HttpStatusCode.OK)
        .json({
          success: true,
          message: "booking status updated",
          changeTravelstatus,
        });
    } catch (error) {
      next(error);
    }
  }
  async completedTravel(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const travelHistory = await this._bookingUseCase.getCompletedTravel(
        userId
      );
      return res
        .status(HttpStatusCode.OK)
        .json({
          success: true,
          message: "user completed travel history",
          travelHistory,
        });
    } catch (error) {
      next(error);
    }
  }
  async getNewBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const{agentId} = req.params
      const newBooking = await this._bookingUseCase.getNewBooking(agentId);
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, message: "new bookings", newBooking });
    } catch (error) {
      next(error);
    }
  }
}
