import { Orders } from "razorpay/dist/types/orders";
import { Booking } from "../../../domain/entities/booking/booking";
import { Coupon } from "../../../domain/entities/coupon/coupon";
import { Packages } from "../../../domain/entities/package/package";
import Wallet from "../../../domain/entities/wallet/wallet";
import { CustomError } from "../../../domain/errors/customError";

interface BookingRepository {
  createBooking(booking: Booking): Promise<Booking | null>;
  getBooking(bookingId: string): Promise<Booking | null>;
  getAgentBooking(
    query: object,
    page: number,
    limit: number
  ): Promise<Booking[] | null>;
  getAdminBookings(
    query: object,
    page: number,
    limit: number
  ): Promise<Booking[] | null>;
  countDocument(query: object): Promise<number>;
  countDocumentAgent(agentId: string): Promise<number>;
  getTravelHistory(userId: string): Promise<Booking[] | null>;
  cancelBooking(
    bookingId: string,
    cancellation_reason: string
  ): Promise<Booking | null>;
  changeBookingStatus(
    bookingId: string,
    status: string,
    cancellation_reason: string
  ): Promise<Booking | null>;
  changeTravelStatus(
    bookingId: string,
    travel_status: string
  ): Promise<Booking | null>;
  getCompletedTravel(userId: string): Promise<Booking[] | null>;
}

interface PackageRepository {
  getPackage(id: string): Promise<Packages | null>;
}
interface CouponRepository {
  getCouponById(coupon_id: string | undefined): Promise<Coupon | null>;
  adduserCoupon(
    coupon_id: string | undefined,
    user_id: string
  ): Promise<Coupon | null>;
}
interface WalletRepository {
  refundWallet(
    userId: string | undefined,
    amount: number,
    reason: string
  ): Promise<Wallet | null>;
}
interface RazorPay {
  createRazorpayOrder(amount: number): Promise<Orders.RazorpayOrder>;
  verifyRazorpayOrder(
    orderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<string>;
}
interface Dependencies {
  Repositories: {
    BookingRepository: BookingRepository;
    PackageRepository: PackageRepository;
    CouponRepository: CouponRepository;
    WalletRepository: WalletRepository;
  };
  Services: {
    RazorPay: RazorPay;
  };
}
export class BookingUseCase {
  private bookingRepository: BookingRepository;
  private packageRepository: PackageRepository;
  private razorPayService: RazorPay;
  private couponRepository: CouponRepository;
  private walletRepository: WalletRepository;

  constructor(dependencies: Dependencies) {
    this.bookingRepository = dependencies.Repositories.BookingRepository;
    this.packageRepository = dependencies.Repositories.PackageRepository;
    this.couponRepository = dependencies.Repositories.CouponRepository;
    this.walletRepository = dependencies.Repositories.WalletRepository;
    this.razorPayService = dependencies.Services.RazorPay;
  }

  async createBooking(booking: Booking): Promise<Booking | null> {
    try {
      const packageId =
        typeof booking.package_id === "string"
          ? booking.package_id
          : booking.package_id._id;

      if (!packageId) {
        throw new CustomError("Invalid package ID", 400);
      }

      const packageData = await this.packageRepository.getPackage(packageId);
      if (!packageData) {
        throw new CustomError("Package not found", 404);
      }

      if (!packageData.travel_agent_id) {
        throw new CustomError("Travel agent ID is missing", 400);
      }

      const userId =
        typeof booking.user_id === "string"
          ? booking.user_id
          : booking.user_id._id;

      if (!userId) {
        throw new CustomError("User ID is missing", 400);
      }

      let totalPrice = packageData.offer_price * booking.members.length;

      if (booking.coupon_id) {
        const couponData = await this.couponRepository.adduserCoupon(
          booking.coupon_id,
          userId
        );

        if (!couponData) {
          throw new CustomError("Coupon not found", 404);
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

      const createdBooking = await this.bookingRepository.createBooking(
        bookingData
      );

      if (!createdBooking) {
        throw new CustomError("Booking creation failed", 500);
      }

      return createdBooking;
    } catch (error) {
      throw error;
    }
  }
  async getBooking(bookingId: string): Promise<Booking | null> {
    try {
      const bookingData = await this.bookingRepository.getBooking(bookingId);
      if (!bookingData) {
        throw new CustomError("booking not found", 404);
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
      const bookingData = await this.bookingRepository.getAgentBooking(
        query,
        page,
        limit
      );
      if (!bookingData) {
        throw new CustomError("booking not found", 404);
      }
      const totalItems = await this.bookingRepository.countDocument(query);
      if (totalItems === 0) {
        throw new CustomError("booking not found", 404);
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

      const bookingData = await this.bookingRepository.getAdminBookings(
        query,
        page,
        limit
      );
      if (!bookingData) {
        throw new CustomError("booking not found", 404);
      }
      const totalItems = await this.bookingRepository.countDocument(query);
      if (totalItems === 0) {
        throw new CustomError("booking not found", 404);
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
      return await this.razorPayService.createRazorpayOrder(amount);
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
      return await this.razorPayService.verifyRazorpayOrder(
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
      console.log(userId);
      const booking = await this.bookingRepository.getTravelHistory(userId);
      if (!booking || booking.length === 0) {
        throw new CustomError("booking not found", 404);
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
      const bookingData = await this.bookingRepository.getBooking(bookingId);
      if (!bookingData) {
        throw new CustomError("booking not found", 404);
      }
      if (bookingData.booking_status === "canceled") {
        throw new CustomError("booking already canceled", 400);
      }
      if (new Date(bookingData.start_date) < new Date()) {
        throw new CustomError("user already travelled", 400);
      }

      let refundAmount = (bookingData.package_id as unknown as Packages)
        .offer_price;
      if (bookingData.payment_status === "pending") {
        const discount = await this.couponRepository.getCouponById(
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
            throw new CustomError("refund amount cannot be negative", 400);
          }
        }
      }
      if (typeof bookingData?.user_id === "object") {
        const reason = "booking canceled";
        await this.walletRepository.refundWallet(
          bookingData.user_id._id,
          refundAmount,
          reason
        );
      } else {
        throw new CustomError("Invalid user ID", 400);
      }
      const cancelBooking = await this.bookingRepository.cancelBooking(
        bookingId,
        cancellation_reason
      );
      if (!cancelBooking) {
        throw new CustomError("booking not found", 404);
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
      const booking = await this.bookingRepository.getBooking(bookingId);
      if (!booking) {
        throw new CustomError("Booking not found", 404);
      }
      if (booking.booking_status == "canceled") {
        throw new CustomError("Booking already canceled", 404);
      }
      if (booking.travel_status == "completed") {
        throw new CustomError("Booking already completed", 404);
      }
      const bookingData = await this.bookingRepository.changeBookingStatus(
        bookingId,
        status,
        cancellation_reason
      );
      if (!bookingData) {
        throw new CustomError("Failed to update booking details", 404);
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
      console.log(bookingId, travel_status, "travel status  ");
      const booking = await this.bookingRepository.getBooking(bookingId);
      if (!booking) {
        throw new CustomError("Booking not found", 404);
      }
      if (booking.travel_status == "completed") {
        throw new CustomError("Booking already completed", 404);
      }
      const bookingData = await this.bookingRepository.changeTravelStatus(
        bookingId,
        travel_status
      );
      if (!bookingData) {
        throw new CustomError("Failed to update booking details", 404);
      }
      return bookingData;
    } catch (error) {
      throw error;
    }
  }
  async getCompletedTravel(userId: string) {
    try {
      const completedTravel=await this.bookingRepository.getCompletedTravel(userId)
      if(!completedTravel){
        throw new CustomError("couldn't find completed travel",500)
      }
      return completedTravel
    } catch (error) {
      throw error;
    }
  }
}
