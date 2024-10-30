import { NextFunction, Request, Response } from "express";
import { BookingUseCase } from "../../../application/usecases/booking";

interface Dependencies {
  useCase: {
    BookingUseCase: BookingUseCase;
  };
}
const isString = (value: unknown): value is string => typeof value === 'string';
export class BookingController {
  private bookingUseCase: BookingUseCase;
  constructor(dependencies: Dependencies) {
    this.bookingUseCase = dependencies.useCase.BookingUseCase;
  }
  async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
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
      const search = isString(req.query.search) ? req.query.search : "";
      const page = isString(req.query.page) ? parseInt(req.query.page, 10) : 1;
      const limit = isString(req.query.limit) ? parseInt(req.query.limit, 10) : 10;
      const {bookingData,totalItems,totalPages,currentPage} = await this.bookingUseCase.getAgentBookings(agentId,search, page, limit);
      return res
        .status(200)
        .json({ status: "success", message: "Fetched All Bookings",filterData:bookingData,totalItems,totalPages,currentPage });
    } catch (error) {
      next(error);
    }
  }
  async getAdminBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const search = isString(req.query.search) ? req.query.search : "";
      const page = isString(req.query.page) ? parseInt(req.query.page, 10) : 1;
      const limit = isString(req.query.limit) ? parseInt(req.query.limit, 10) : 10;

      const {bookingData,totalItems,totalPages,currentPage}= await this.bookingUseCase.getAdminBookings(search,
        page,
        limit);
      return res
        .status(200)
        .json({ status: "success", message: "Fetched All Bookings", filterData:bookingData,totalItems,totalPages,currentPage });
    } catch (error) {
      next(error);
    }
  }
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount } = req.body;
      const order = await this.bookingUseCase.createRazorpayOrder(amount);
      return res
        .status(200)
        .json({ status: "success", message: "razorpay Created", order });
    } catch (error) {
      next(error);
    }
  }
  async verifyOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId, razorpayPaymentId, razorpaySignature } = req.body;
      const successpayment = await this.bookingUseCase.verifyRazorpayOrder(
        orderId,
        razorpayPaymentId,
        razorpaySignature
      );
      return res
        .status(200)
        .json({ status: "success", message: "payment verified", successpayment });
    } catch (error) {
      next(error);
    }
  }
  async getTravelHistory(req:Request,res:Response,next:NextFunction){
    try {
      const {userId}=req.params
      const travelHistory=await this.bookingUseCase.getTravelHistory(userId)
      return res.status(200).json({status:true,message:"user travel history",travelHistory})
    } catch (error) {
      next(error)
    }
  }
  async cancelBooking(req:Request,res:Response,next:NextFunction){
    try {
      console.log(req.params)
      const {bookingId}=req.params
      const cancelBooking=await this.bookingUseCase.cancelBooking(bookingId)
      return res.status(200).json({status:true,message:"booking cancelled",cancelBooking})
    } catch (error) {
      next(error)
    }
  }
}
