import { FilterQuery } from "mongoose";
import { Iagent } from "../../domain/entities/agent/agent";
import { Booking } from "../../domain/entities/booking/booking";
import { Packages } from "../../domain/entities/package/package";
import { Iuser } from "../../domain/entities/user/user";
import bookingModel from "../database/models/bookingModel";

export class MongoBookingRepository {
  async createBooking(booking: Booking): Promise<Booking | null> {
    const createdBooking = await bookingModel.create(booking);
    const bookingData = createdBooking.toObject() as unknown as Booking;
    return bookingData;
  }
  async getBooking(bookingId: string): Promise<Booking | null> {
    try {
      const booking = await bookingModel
        .findOne({ _id: bookingId })
        .populate<{ user_id: Iuser }>("user_id")
        .populate<{ package_id: Packages }>("package_id")
        .exec(); // Ensure proper promise handling

      return booking as Booking | null;
    } catch (error) {
      console.error("Error fetching booking:", error);
      return null;
    }
  }
  async getAgentBooking(agentId: string): Promise<Booking[] | null> {
    try {
      const booking = await bookingModel
        .find({ travel_agent_id: agentId })
        .populate<{ user_id: Iuser }>("user_id")
        .populate<{ package_id: Packages }>("package_id")
        .exec(); // Ensure proper promise handling

      return booking as Booking[] | [];
    } catch (error) {
      console.error("Error fetching booking:", error);
      return null;
    }
  }
  async getAdminBookings(query:FilterQuery<Booking>,page:number,limit:number): Promise<Booking[] | null> {
    try {
      const bookings = await bookingModel
        .find(query)
        .populate<{ user_id: Iuser }>("user_id")
        .populate<{ package_id: Packages }>("package_id")
        .populate<{ travel_agent_id: Iagent }>("travel_agent_id")
        .skip((page-1)*limit).limit(limit).exec();
      return bookings.map((booking) => {
        const bookingData = booking.toObject() as unknown as Booking;
        return bookingData;
      }) as Booking[] | null;
    } catch (error) {
      console.error("Error fetching booking:", error);
      return null;
    }
  }
  async countDocument(query:FilterQuery<Booking>): Promise<number> {
    return bookingModel.countDocuments(query);
  }
}