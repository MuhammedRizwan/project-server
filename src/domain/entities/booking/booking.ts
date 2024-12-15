import { ObjectId } from "mongoose";
import { Iuser } from "../user/user";
import { Iagent } from "../agent/agent";
import { Packages } from "../package/package";
import Review from "../review/review";
import { Orders } from "razorpay/dist/types/orders";

export interface Booking {
  _id?: ObjectId;
  user_id: string | Iuser;
  travel_agent_id: string | Iagent;
  package_id: string | Packages;
  bill_details: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
  };
  members: { name: string; age: number }[];
  payment_amount: number;
  payment_status: "pending" | "paid" | "refunded";
  booking_status: "pending" | "confirmed" | "canceled";
  travel_status: "pending" | "on-going" | "completed" | "canceled";
  coupon_id?: string;
  start_date: string;
  booking_date: string;
  review_id?: string | Review;
  cancellation_reason?: string;
}

export interface BookingRepository {
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
  addReview(
    bookingId: string,
    reviewId: string | undefined
  ): Promise<Booking | null>;
  deleteReview(bookingId: string): Promise<Booking | null>;
  getAllBookingsCount(): Promise<{
    bookingcount: number;
    completedbooking: number;
    ongoingbooking: number;
    pendingbooking: number;
    cancelbooking: number;
  }>;
  getAgentBookingData(agentId: string): Promise<{
    totalbooking: number;
    completed: number;
    ongoing: number;
    pending: number;
    cancel: number;
  }>;
  getAgentBookingRevenue(agentId: string): Promise<number>;
  gookingData(): Promise<
    {
      _id: number; // Month (1-12)
      totalBookings: number;
    }[]
  >;
  agentBookings(agentId: string): Promise<
  {
    _id: number; // Month (1-12)
    totalBookings: number;
  }[]
>;
getNewBooking(agentId: string): Promise<Booking[] | null>;
}

export interface RazorPay {
  createRazorpayOrder(amount: number): Promise<Orders.RazorpayOrder>;
  verifyRazorpayOrder(
    orderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<string>;
}
