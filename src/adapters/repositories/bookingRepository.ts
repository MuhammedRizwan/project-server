import { FilterQuery } from "mongoose";
import { Iagent } from "../../domain/entities/agent/agent";
import { Booking } from "../../domain/entities/booking/booking";
import { Packages } from "../../domain/entities/package/package";
import { Iuser } from "../../domain/entities/user/user";
import bookingModel from "../database/models/bookingModel";
import { CustomError } from "../../domain/errors/customError";
import Review from "../../domain/entities/review/review";

export class BookingRepository {
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
  async getAgentBooking(
    query: FilterQuery<Booking>,
    page: number,
    limit: number
  ): Promise<Booking[] | null> {
    try {
      const booking = await bookingModel
        .find(query)
        .populate<{ user_id: Iuser }>("user_id")
        .populate<{ package_id: Packages }>("package_id")
        .skip((page - 1) * limit)
        .limit(limit);

      return booking.map((booking) => {
        const bookingData = booking.toObject() as unknown as Booking;
        return bookingData;
      }) as Booking[] | null;
    } catch (error) {
      console.error("Error fetching booking:", error);
      return null;
    }
  }
  async getAdminBookings(
    query: FilterQuery<Booking>,
    page: number,
    limit: number
  ): Promise<Booking[] | null> {
    try {
      const bookings = await bookingModel
        .find(query)
        .populate<{ user_id: Iuser }>("user_id")
        .populate<{ package_id: Packages }>("package_id")
        .populate<{ travel_agent_id: Iagent }>("travel_agent_id")
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
      return bookings.map((booking) => {
        const bookingData = booking.toObject() as unknown as Booking;
        return bookingData;
      }) as Booking[] | null;
    } catch (error) {
      console.error("Error fetching booking:", error);
      return null;
    }
  }
  async countDocument(query: FilterQuery<Booking>): Promise<number> {
    return bookingModel.countDocuments(query);
  }
  async countDocumentAgent(agentId: string): Promise<number> {
    return bookingModel.countDocuments({ travel_agent_id: agentId });
  }
  async getTravelHistory(userId: string): Promise<Booking[]> {
    const booking = await bookingModel
      .find({ user_id: userId })
      .populate<{ user_id: Iuser }>("user_id")
      .populate<{ package_id: Packages }>("package_id")
      .populate<{ travel_agent_id: Iagent }>("travel_agent_id")
      .exec();
    return booking as Booking[] | [];
  }
  async cancelBooking(
    bookingId: string,
    cancellation_reason: string
  ): Promise<Booking | null> {
    try {
      const booking = await bookingModel.findOneAndUpdate(
        { _id: bookingId },
        {
          $set: {
            payment_status: "refunded",
            booking_status: "canceled",
            travel_status: "canceled",
            cancellation_reason,
          },
        },
        { new: true }
      );
      return booking as Booking | null;
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
      const booking = await bookingModel.findOneAndUpdate(
        { _id: bookingId },
        { $set: { booking_status: status, cancellation_reason } },
        { new: true }
      );
      if (!booking) {
        throw new CustomError("booking not found", 404);
      }
      return booking as unknown as Booking | null;
    } catch (error) {
      throw error;
    }
  }
  async changeTravelStatus(
    bookingId: string,
    travel_status: string
  ): Promise<Booking | null> {
    try {
      const booking = await bookingModel.findOneAndUpdate(
        { _id: bookingId },
        { $set: { travel_status } },
        { new: true }
      );
      if (!booking) {
        throw new CustomError("booking not found", 404);
      }
      return booking as unknown as Booking | null;
    } catch (error) {
      throw error;
    }
  }
  async getCompletedTravel(userId: string): Promise<Booking[]> {
    const booking = await bookingModel
      .find({ user_id: userId, travel_status: "completed" })
      .populate<{ package_id: Packages }>("package_id")
      .populate<{ review_id: Review }>("review_id")
      .exec();
    return booking as Booking[] | [];
  }
  async addReview(
    bookingId: string,
    reviewId: string | undefined
  ): Promise<Booking | null> {
    try {
      const booking = await bookingModel.findOneAndUpdate(
        { _id: bookingId },
        { $set: { review_id: reviewId } },
        { new: true }
      );
      if (!booking) {
        throw new CustomError("booking not found", 404);
      }
      const populatedBooking = await bookingModel
        .findById(booking._id)
        .populate<{ package_id: Packages }>("package_id")
        .populate<{ review_id: Review }>("review_id")

      return populatedBooking as unknown as Booking | null;
    } catch (error) {
      throw error;
    }
  }
  async deleteReview(bookingId: string): Promise<Booking | null> {
    try {
      const booking = await bookingModel.findOneAndUpdate(
        { _id: bookingId },
        { $unset: { review_id: "" } },
        { new: true }
      );
      if (!booking) {
        throw new CustomError("booking not found", 404);
      }
      const populatedBooking = await bookingModel
        .findById(booking._id)
        .populate<{ package_id: Packages }>("package_id")
        .populate<{ review_id: Review }>("review_id")

      return populatedBooking as unknown as Booking | null;
    } catch (error) {
      throw error;
    }
  }
}
