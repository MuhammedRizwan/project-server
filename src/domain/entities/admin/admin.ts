import { ObjectId } from "mongoose";

export interface Iadmin {
  _id?: string ;
  admin_name?: string;
  email: string;
  phone?: string;
  password: string;
  refreshToken?: string;
}

