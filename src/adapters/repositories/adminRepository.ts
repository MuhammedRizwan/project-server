import { Iadmin } from "../../domain/entities/admin/admin";
import adminModel from "../database/models/adminModel";
import { CustomError } from "../../domain/errors/customError";

export class MongoAdminRepository {
  async findAdminByEmail(email: string): Promise<Iadmin | null> {
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return admin;
    }
    const adminData: Iadmin = {
      ...(admin.toObject() as unknown as Iadmin),
      _id: admin._id as string,
    };
    return adminData;
  }
  async changePassword(email: string, password: string) {
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
      _id: updatedAdmin._id as string,
    };
    return adminData;
  }
  async getAdmin(id: string): Promise<Iadmin | null> {
    try {
      const admin: Iadmin | null = await adminModel.findOne({ _id: id });
      if (!admin) {
        throw new CustomError("admin not found", 404);
      }
      return admin;
    } catch (error) {
      throw error;
    }
  }
  async addRefreshToken(id: string, refreshToken: string): Promise<void> {
    try {
      const updatedAdmin = await adminModel.findOneAndUpdate(
        { _id: id },
        { $set: { refreshToken: refreshToken } },
        { new: true }
      );
      if (!updatedAdmin) {
        throw new CustomError("admin not found", 404);
      }
    } catch (error) {
      throw error;
    }
  }
}
