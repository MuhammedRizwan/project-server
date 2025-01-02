import { Orders } from "razorpay/dist/types/orders";
import {
  Booking,
  BookingRepository,
  RazorPay,
} from "../../../domain/entities/booking/booking";
import {
  PackageRepository,
  Packages,
} from "../../../domain/entities/package/package";
import { CustomError } from "../../../domain/errors/customError";
import { CouponRepository } from "../../../domain/entities/coupon/coupon";
import { WalletRepository } from "../../../domain/entities/wallet/wallet";
import { Dependencies } from "../../../domain/entities/depencies/depencies";
import configKeys from "../../../config";
import HttpStatusCode from "../../../domain/enum/httpstatus";

export class BookingUseCase {
  private _bookingRepository: BookingRepository;
  private _packageRepository: PackageRepository;
  private _razorPayService: RazorPay;
  private _couponRepository: CouponRepository;
  private _walletRepository: WalletRepository;

  constructor(dependencies: Dependencies) {
    this._bookingRepository = dependencies.Repositories.BookingRepository;
    this._packageRepository = dependencies.Repositories.PackageRepository;
    this._couponRepository = dependencies.Repositories.CouponRepository;
    this._walletRepository = dependencies.Repositories.WalletRepository;
    this._razorPayService = dependencies.Services.RazorPay;
  }

  async createBooking(booking: Booking): Promise<Booking | null> {
    try {
      const packageId =
        typeof booking.package_id === "string"
          ? booking.package_id
          : booking.package_id._id;

      if (!packageId) {
        throw new CustomError("Invalid package ID", HttpStatusCode.BAD_REQUEST);
      }

      const packageData = await this._packageRepository.getPackage(packageId);
      if (!packageData) {
        throw new CustomError("Package not found", HttpStatusCode.NOT_FOUND);
      }

      if (!packageData.travel_agent_id) {
        throw new CustomError("Travel agent ID is missing", HttpStatusCode.BAD_REQUEST);
      }

      const userId =
        typeof booking.user_id === "string"
          ? booking.user_id
          : booking.user_id._id;

      if (!userId) {
        throw new CustomError("User ID is missing", HttpStatusCode.BAD_REQUEST);
      }

      let totalPrice = packageData.offer_price * booking.members.length;

      if (booking.coupon_id) {
        const couponData = await this._couponRepository.adduserCoupon(
          booking.coupon_id,
          userId
        );

        if (!couponData) {
          throw new CustomError("Coupon not found", HttpStatusCode.NOT_FOUND);
        }

        booking.coupon_id = couponData._id;
        let discount = (totalPrice * Number(couponData.percentage)) / 100;
        if (discount > Number(couponData.max_amount)) {
          discount = Number(couponData.max_amount);
        }
        totalPrice -= discount;
      }
      if (!booking.coupon_id) {
        delete booking.coupon_id;
      }

      const bookingData: Booking = {
        ...booking,
        payment_amount: totalPrice,
        travel_agent_id: packageData.travel_agent_id.toString(),
        payment_status: "paid",
        booking_status: "pending",
        travel_status: "pending",
        booking_date: new Date().toISOString(),
      };

      const createdBooking = await this._bookingRepository.createBooking(
        bookingData
      );

      if (!createdBooking) {
        throw new CustomError("Booking creation failed", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      if(createdBooking.payment_method ==='wallet'){
        const wallet = await this._walletRepository.getWallet(userId);
        if (!wallet) {
          await this._walletRepository.createWallet(userId);
        }
        await this._walletRepository.debitWallet(
          createdBooking._id as unknown as string,
          userId,
          totalPrice,
          "user booked a package"
        );
      }

      const adminWallet = await this._walletRepository.getWallet(
        configKeys.ADMIN_ID
      );
      if (!adminWallet) {
        await this._walletRepository.createWallet(configKeys.ADMIN_ID);
      }
      const admincommision =
        (totalPrice * Number(configKeys.ADMIN_COMMISION)) / 100;
      const addAdminWallet = await this._walletRepository.addAdminWallet(
        createdBooking._id as unknown as string,
        configKeys.ADMIN_ID,
        admincommision,
        "admin commission for booking"
      );
      const agentWallet = await this._walletRepository.getWallet(
        createdBooking.travel_agent_id as unknown as string
      );
      if (!agentWallet) {
        await this._walletRepository.createWallet(
          createdBooking.travel_agent_id as unknown as string
        );
      }
      const addAgentWallet = await this._walletRepository.addAdminWallet(
        createdBooking._id as unknown as string,
        createdBooking.travel_agent_id as string,
        totalPrice - admincommision,
        "user booked a package"
      );

      return createdBooking;
    } catch (error) {
      throw error;
    }
  }
  async getBooking(bookingId: string): Promise<Booking | null> {
    try {
      const bookingData = await this._bookingRepository.getBooking(bookingId);
      if (!bookingData) {
        throw new CustomError("booking not found", HttpStatusCode.NOT_FOUND);
      }
      return bookingData;
    } catch (error) {
      throw error;
    }
  }
  async getAgentBookings(
    agentId: string,
    packageId: string,
    search: string,
    page: number,
    limit: number
  ) {
    try {
      const query = search
        ? {
            category_name: { $regex: search, $options: "i" },
            travel_agent_id: agentId,
            package_id: packageId,
          }
        : { travel_agent_id: agentId, package_id: packageId };
      const bookingData = await this._bookingRepository.getAgentBooking(
        query,
        page,
        limit
      );
      if (!bookingData) {
        throw new CustomError("booking not found", HttpStatusCode.NOT_FOUND);
      }
      const totalItems = await this._bookingRepository.countDocument(query);
      if (totalItems === 0) {
        throw new CustomError("booking not found", HttpStatusCode.NOT_FOUND);
      }
      return {
        bookingData,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAdminBookings(search: string, page: number, limit: number) {
    try {
      const query = search
        ? { category_name: { $regex: search, $options: "i" } }
        : {};

      const bookingData = await this._bookingRepository.getAdminBookings(
        query,
        page,
        limit
      );
      if (!bookingData) {
        throw new CustomError("booking not found", HttpStatusCode.NOT_FOUND);
      }
      const totalItems = await this._bookingRepository.countDocument(query);
      if (totalItems === 0) {
        throw new CustomError("booking not found", HttpStatusCode.NOT_FOUND);
      }
      return {
        bookingData,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      };
    } catch (error) {
      throw error;
    }
  }

  async createRazorpayOrder(amount: number): Promise<Orders.RazorpayOrder> {
    try {
      return await this._razorPayService.createRazorpayOrder(amount);
    } catch (error) {
      throw error;
    }
  }
  async verifyRazorpayOrder(
    orderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<string> {
    try {
      return await this._razorPayService.verifyRazorpayOrder(
        orderId,
        razorpayPaymentId,
        razorpaySignature
      );
    } catch (error) {
      throw error;
    }
  }
  async getTravelHistory(userId: string): Promise<Booking[]> {
    try {
      const booking = await this._bookingRepository.getTravelHistory(userId);
      if (!booking || booking.length === 0) {
        throw new CustomError("booking not found", HttpStatusCode.NOT_FOUND);
      }
      return booking;
    } catch (error) {
      throw error;
    }
  }
  async cancelBooking(
    bookingId: string,
    cancellation_reason: string
  ): Promise<Booking | null> {
    try {
      const bookingData = await this._bookingRepository.getBooking(bookingId);
      if (!bookingData) {
        throw new CustomError("booking not found", HttpStatusCode.NOT_FOUND);
      }
      if (bookingData.booking_status === "canceled") {
        throw new CustomError("booking already canceled", HttpStatusCode.BAD_REQUEST);
      }
      if (new Date(bookingData.start_date) < new Date()) {
        throw new CustomError("user already travelled", HttpStatusCode.BAD_REQUEST);
      }

      let refundAmount = (bookingData.package_id as unknown as Packages)
        .offer_price;
      if (bookingData.payment_status === "pending") {
        const discount = await this._couponRepository.getCouponById(
          bookingData.coupon_id
        );
        if (discount) {
          let discountAmount =
            ((bookingData.package_id as unknown as Packages).offer_price *
              Number(discount.percentage)) /
            100;
          if (discountAmount > Number(discount.max_amount)) {
            discountAmount = Number(discount.max_amount);
          }
          refundAmount = bookingData.payment_amount - discountAmount;
          if (refundAmount < 0) {
            throw new CustomError("refund amount cannot be negative", HttpStatusCode.BAD_REQUEST);
          }
        }
      }
      const reason = "Booking Cancelled";
      const admindebitAmount =
        (refundAmount * Number(configKeys.ADMIN_COMMISION)) / 100;
      await this._walletRepository.debitWallet(
        bookingData._id as unknown as string,
        configKeys.ADMIN_ID,
        admindebitAmount,
        reason
      );
      await this._walletRepository.debitWallet(
        bookingData._id as unknown as string,
        bookingData.travel_agent_id as unknown as string,
        bookingData.payment_amount - admindebitAmount,
        reason
      );
      if (typeof bookingData?.user_id === "object") {
        const userWallet = await this._walletRepository.getWallet(
          bookingData.user_id._id as string
        );
        if (!userWallet) {
          await this._walletRepository.createWallet(bookingData.user_id._id);
        }
        const reason = "booking canceled";
        await this._walletRepository.refundWallet(
          bookingData._id as unknown as string,
          bookingData.user_id._id,
          refundAmount,
          reason
        );
      } else {
        throw new CustomError("Invalid user ID", HttpStatusCode.BAD_REQUEST);
      }
      const cancelBooking = await this._bookingRepository.cancelBooking(
        bookingId,
        cancellation_reason
      );
      if (!cancelBooking) {
        throw new CustomError("booking not found", HttpStatusCode.NOT_FOUND);
      }
      return cancelBooking;
    } catch (error) {
      throw error;
    }
  }
  async changeBookingStatus(
    bookingId: string,
    status: string,
    cancellation_reason: string
  ): Promise<Booking | null> {
    try {
      const booking = await this._bookingRepository.getBooking(bookingId);
      if (!booking) {
        throw new CustomError("Booking not found", HttpStatusCode.NOT_FOUND);
      }
      if (booking.booking_status == "canceled") {
        throw new CustomError("Booking already canceled", HttpStatusCode.NOT_FOUND);
      }
      if (booking.travel_status == "completed") {
        throw new CustomError("Booking already completed", HttpStatusCode.NOT_FOUND);
      }
      const bookingData = await this._bookingRepository.changeBookingStatus(
        bookingId,
        status,
        cancellation_reason
      );
      if (!bookingData) {
        throw new CustomError("Failed to update booking details", HttpStatusCode.NOT_FOUND);
      }
      return bookingData;
    } catch (error) {
      throw error;
    }
  }
  async changeTravelStatus(
    bookingId: string,
    travel_status: string
  ): Promise<Booking | null> {
    try {
      const booking = await this._bookingRepository.getBooking(bookingId);
      if (!booking) {
        throw new CustomError("Booking not found", HttpStatusCode.NOT_FOUND);
      }
      if (booking.travel_status == "completed") {
        throw new CustomError("Booking already completed", HttpStatusCode.NOT_FOUND);
      }
      const bookingData = await this._bookingRepository.changeTravelStatus(
        bookingId,
        travel_status
      );
      if (!bookingData) {
        throw new CustomError("Failed to update booking details", HttpStatusCode.NOT_FOUND);
      }
      return bookingData;
    } catch (error) {
      throw error;
    }
  }
  async getCompletedTravel(userId: string) {
    try {
      const completedTravel = await this._bookingRepository.getCompletedTravel(
        userId
      );
      if (!completedTravel) {
        throw new CustomError("couldn't find completed travel", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      return completedTravel;
    } catch (error) {
      throw error;
    }
  }
  async getNewBooking(agentId: string) {
    try {
      const bookings=await this._bookingRepository.getNewBooking(agentId);
      if (!bookings) {  
        throw new CustomError("couldn't find new booking", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      return bookings;
    } catch (error) {
      throw error;
    }
  }
}
