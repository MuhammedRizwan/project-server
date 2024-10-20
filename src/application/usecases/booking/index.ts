import { Booking } from "../../../domain/entities/booking/booking";
import { Package } from "../../../domain/entities/package/package";
import { CustomError } from "../../../domain/errors/customError";


interface MongoBookingRepository {
  createBooking(booking: Booking): Promise<Booking | null>;
  getBooking(bookingId: string): Promise<Booking | null>;
  getAgentBooking(agentId: string): Promise<Booking[] | null>;
  getAdminBookings(): Promise<Booking[] | null>;
}

interface MongoPackageRepository {
  getPackage(id: string): Promise<Package | null>;
}
interface RazorPay {
  createRazorpayOrder(amount: number): Promise<any>;
  verifyRazorpayOrder(orderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<string>;
}
interface Dependencies {
  Repositories: {
    MongoBookingRepository: MongoBookingRepository;
    MongoPackageRepository: MongoPackageRepository;
  };
  Services: {
    RazorPay: RazorPay;
  };
}
export class BookingUseCase {
  private bookingRepository: MongoBookingRepository;
  private packageRepository: MongoPackageRepository;
  private razorPayService: RazorPay;

  constructor(dependencies: Dependencies) {
    this.bookingRepository = dependencies.Repositories.MongoBookingRepository;
    this.packageRepository = dependencies.Repositories.MongoPackageRepository;
    this.razorPayService = dependencies.Services.RazorPay;
  }

  async createBooking(booking: Booking): Promise<Booking | null> {
    try {
      const packageId =
        typeof booking.package_id === "string"
          ? booking.package_id
          : booking.package_id._id; // Ensure it's a string
  
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
  
      const bookingData: Booking = {
        ...booking,
        payment_amount: packageData.offer_price,
        travel_agent_id: packageData.travel_agent_id.toString(), // Convert ObjectId to string
        payment_status: "pending",
        booking_status: "confirmed",
        travel_status: "pending",
        booking_date: new Date().toISOString(),
      };
  
      const createdBooking = await this.bookingRepository.createBooking(bookingData);
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
  async getAgentBookings(agentId: string): Promise<Booking[] | null> {
    try {
      const bookingData = await this.bookingRepository.getAgentBooking(agentId);
      if (!bookingData) {
        throw new CustomError("booking not found", 404);
      }
      return bookingData;
    } catch (error) {
      throw error;
    }
  }

  async getAdminBookings(): Promise<Booking[] | null> {
    try {
      const bookingData = await this.bookingRepository.getAdminBookings();
      if (!bookingData) {
        throw new CustomError("booking not found", 404);
      }
      return bookingData;
    } catch (error) {
      throw error;
    }
  }

  async createRazorpayOrder(amount:number): Promise<any> {
    try {
      return await this.razorPayService.createRazorpayOrder(amount);
    } catch (error) {
      throw error;
    }
  }
  async verifyRazorpayOrder(orderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<string> {
    try {
      return await this.razorPayService.verifyRazorpayOrder(orderId, razorpayPaymentId, razorpaySignature);
    } catch (error) {
      throw error;
    }
  }
}
