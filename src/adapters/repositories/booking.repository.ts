import { FilterQuery } from "mongoose";
import { Iagent } from "../../domain/entities/agent/agent";
import { Booking } from "../../domain/entities/booking/booking";
import { Packages } from "../../domain/entities/package/package";
import { Iuser } from "../../domain/entities/user/user";
import bookingModel from "../database/models/booking.model";
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
        .limit(limit)
        .sort({ createdAt: -1 });
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
        .sort({ createdAt: -1 });
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
  async getTravelHistory(userId: string): Promise<Booking[] | null> {
    const booking = await bookingModel
      .find({ user_id: userId })
      .populate<{ user_id: Iuser }>("user_id")
      .populate<{ package_id: Packages }>("package_id")
      .populate<{ travel_agent_id: Iagent }>("travel_agent_id")
      .sort({ createdAt: -1 });
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
  async getCompletedTravel(userId: string): Promise<Booking[] | null> {
    const booking = await bookingModel
      .find({ user_id: userId, travel_status: "completed" })
      .populate<{ package_id: Packages }>("package_id")
      .populate<{ review_id: Review }>("review_id")
      .sort({ createdAt: -1 });
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
        .populate<{ review_id: Review }>("review_id");

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
        .populate<{ review_id: Review }>("review_id");

      return populatedBooking as unknown as Booking | null;
    } catch (error) {
      throw error;
    }
  }
  async getAllBookingsCount(): Promise<{
    bookingcount: number;
    completedbooking: number;
    ongoingbooking: number;
    pendingbooking: number;
    cancelbooking: number;
  }> {
    try {
      const bookingcount = await bookingModel.countDocuments();
      const completedbooking = await bookingModel.countDocuments({
        travel_status: "completed",
      });
      const ongoingbooking = await bookingModel.countDocuments({
        travel_status: "ongoing",
      });
      const pendingbooking = await bookingModel.countDocuments({
        travel_status: "pending",
      });
      const cancelbooking = await bookingModel.countDocuments({
        travel_status: "canceled",
      });
      return {
        bookingcount,
        completedbooking,
        ongoingbooking,
        pendingbooking,
        cancelbooking,
      };
    } catch (error) {
      throw error;
    }
  }
  async getAgentBookingData(agentId: string): Promise<{
    totalbooking: number;
    completed: number;
    ongoing: number;
    pending: number;
    cancel: number;
  }> {
    try {
      const totalbooking = await bookingModel.countDocuments({
        travel_agent_id: agentId,
      });
      const completed = await bookingModel.countDocuments({
        travel_agent_id: agentId,
        travel_status: "completed",
      });
      const ongoing = await bookingModel.countDocuments({
        travel_agent_id: agentId,
        travel_status: "ongoing",
      });
      const pending = await bookingModel.countDocuments({
        travel_agent_id: agentId,
        travel_status: "pending",
      });
      const cancel = await bookingModel.countDocuments({
        travel_agent_id: agentId,
        travel_status: "canceled",
      });
      return {
        totalbooking,
        completed,
        ongoing,
        pending,
        cancel,
      };
    } catch (error) {
      throw error;
    }
  }
  async getAgentBookingRevenue(agentId: string): Promise<number> {
    try {
      const totalRevenue = await bookingModel.find(
        { travel_agent_id: agentId, travel_status: "completed" },
        { payment_amount: 1 }
      );
      const revenue = totalRevenue.reduce(
        (acc, booking) => acc + booking.payment_amount,
        0
      );
      return Math.floor(revenue);
    } catch (error) {
      throw error;
    }
  }
  async gookingData() {
    try {
      const year = new Date().getFullYear();
      const bookings = await bookingModel.aggregate([
        {
          $match: {
            booking_date: {
              $gte: new Date(`${year}-01-01T00:00:00.000Z`),
              $lte: new Date(`${year}-12-31T23:59:59.999Z`),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$booking_date" },
            totalBookings: { $sum: "$payment_amount" },
          },
        },
      ]);
      return bookings;
    } catch (error) {
      throw error;
    }
  }
  async agentBookings(agentId: string) {
    try {
      const year = new Date().getFullYear();
      const agentBookings = await bookingModel.aggregate([
        {
          $match: {
            travel_agent_id: agentId, // Match the travel agent ID
            booking_date: {
              $gte: new Date(`${year}-01-01T00:00:00.000Z`),
              $lte: new Date(`${year}-12-31T23:59:59.999Z`),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$booking_date" },
            agentBookings: { $sum: 1 },
          },
        },
      ]);
      return agentBookings;
    } catch (error) {
      throw error;
    }
  }
  async getNewBooking(agentId: string): Promise<Booking[] | null> {
    try {
      const booking = await bookingModel
        .find({
          travel_agent_id: agentId,
          travel_status: "pending",
          booking_status: "pending",
        })
        .sort({ createdAt: -1 })
        .limit(5).populate('user_id');
      return booking as unknown as Booking[] | null;
    } catch (error) {
      throw error;
    }
  }
}
