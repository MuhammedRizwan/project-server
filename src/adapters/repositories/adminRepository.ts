import { ObjectId } from "mongoose";
import { Iadmin } from "../../domain/entities/admin/admin";
import adminModel from "../database/models/adminModel";

export class MongoAdminRepository{
      async findAdminByEmail(email: string): Promise<Iadmin | null> {
        const admin = await adminModel.findOne({ email });
        if (!admin) {
          return admin;
        }
        const adminData: Iadmin = {
          ...(admin.toObject() as unknown as Iadmin),
          _id: admin._id as ObjectId,
        };
        return adminData;
      }
      async changePassword(email:string,password:string){
        const updatedAdmin = await adminModel.findOneAndUpdate(
          { email },
          { $set: { password: password } },
          { new: true }
        );
        if (!updatedAdmin) {
          return null;
        }
        const adminData: Iadmin = {
          ...(updatedAdmin.toObject() as unknown as Iadmin),
          _id: updatedAdmin._id as ObjectId,
        };
        return adminData;
      }
      
}