import { ObjectId } from "mongoose";

export interface Iadmin {
  _id?: ObjectId ;
  admin_name?: string;
  email: string;
  phone?: string;
  password: string;
}

