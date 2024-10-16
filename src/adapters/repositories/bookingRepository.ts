import { Booking } from "../../domain/entities/booking/booking";
import { Package } from "../../domain/entities/package/package";
import { Iuser } from "../../domain/entities/user/user";
import bookingModel from "../database/models/bookingModel";



export class MongoBookingRepository {
   async createBooking(booking: Booking): Promise<Booking | null> {
    console.log("bookingRepository",booking);
    const createdBooking = await bookingModel.create(booking);
    const bookingData = createdBooking.toObject() as unknown as Booking;
    return bookingData;
  }
  async getBooking(bookingId: string): Promise<Booking | null> {
    try {
      const booking = await bookingModel
        .findOne({ _id: bookingId })
        .populate<{ user_id: Iuser }>("user_id")
        .populate<{ package_id: Package }>("package_id")
        .exec(); // Ensure proper promise handling
  
      return booking as Booking | null;
    } catch (error) {
     console.error("Error fetching booking:", error);
     return null; 
    }
  }
  async getAgentBooking(agentId: string): Promise<Booking[] |null> {
    try {
      const booking = await bookingModel
        .find({ travel_agent_id: agentId })
        .populate<{ user_id: Iuser }>("user_id")
        .populate<{ package_id: Package }>("package_id")
        .exec(); // Ensure proper promise handling
  
      return booking as Booking[] | []; ;
    } catch (error) {
      console.error("Error fetching booking:", error);
      return null;
    }
  }
  async getAllBookings(): Promise<Booking[] | null> {
    const bookings: Booking[] | null = await bookingModel.find();
    return bookings;
  }
}