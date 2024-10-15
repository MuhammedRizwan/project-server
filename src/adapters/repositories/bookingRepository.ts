import { Ibooking } from "../../domain/entities/booking/booking";
import bookingModel from "../database/models/bookingModel";



export class MongoBookingRepository {
   async createBooking(booking: Ibooking): Promise<Ibooking | null> {
    console.log("bookingRepository",booking);
    const createdBooking = await bookingModel.create(booking);
    const bookingData = createdBooking.toObject() as unknown as Ibooking;
    return bookingData;
  }
  async getBooking(id: string): Promise<Ibooking | null> {
    const booking: Ibooking | null = await bookingModel.findById(id);
    return booking;
  }
  async getAllBookings(): Promise<Ibooking[] | null> {
    const bookings: Ibooking[] | null = await bookingModel.find();
    return bookings;
  }
}