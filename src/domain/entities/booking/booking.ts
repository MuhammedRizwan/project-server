import { ObjectId } from "mongoose";
import { Iuser } from "../user/user";
import {Iagent} from "../agent/agent";
import {Packages } from "../package/package";
export interface Booking {
  _id?: ObjectId;
  user_id: string|Iuser;
  travel_agent_id: string|Iagent;
  package_id: string|Packages;
  bill_details: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      address: string;
    };
  members: { name: string,age: number}[];
  payment_amount: number;
  payment_status: "pending" | "completed";
  booking_status: "pending" | "confirmed" | "cancelled";
  travel_status: "pending" | "in-progress" | "completed";
  coupon_id?:string
  start_date: string; // Use ISO string for date handling
  booking_date: string; // ISO string for booking timestamp
}