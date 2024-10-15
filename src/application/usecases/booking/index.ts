import { Ibooking } from "../../../domain/entities/booking/booking";
import { Package } from "../../../domain/entities/package/package";
import { CustomError } from "../../../domain/errors/customError";

interface MongoBookingRepository {
  createBooking(booking: Ibooking): Promise<Ibooking | null>;
  getBooking(id: string): Promise<Ibooking | null>;
  getAllBookings(): Promise<Ibooking[] | null>;
}

interface MongoPackageRepository {
  getPackage(id: string): Promise<Package | null>;
}
interface Dependencies {
  Repositories: {
    MongoBookingRepository: MongoBookingRepository;
    MongoPackageRepository: MongoPackageRepository;
  };
}
export class BookingUseCase {
  private bookingRepository: MongoBookingRepository;
  private packageRepository: MongoPackageRepository;

  constructor(dependencies: Dependencies) {
    this.bookingRepository = dependencies.Repositories.MongoBookingRepository;
    this.packageRepository = dependencies.Repositories.MongoPackageRepository;
  }

  async createBooking(booking: Ibooking): Promise<Ibooking | null> {
    try {
      const packageData = await this.packageRepository.getPackage(
        booking.package_id
      )
      if (!packageData) {
        throw new CustomError("package not found", 404);
      }
      const bookingData={
        ...booking,
        payment_amount:packageData.offer_price,
        travel_agent_id:packageData.travel_agent_id,
        payment_status:"pending",
        booking_status:"confirmed",
        travel_status:"pending",
      }
      const createdBooking = await this.bookingRepository.createBooking(
        bookingData
      );
      if (!createdBooking) {
        throw new CustomError("booking creation failed", 500);
      }
      return createdBooking;
    } catch (error) {
      throw error;
    }
  }
}
