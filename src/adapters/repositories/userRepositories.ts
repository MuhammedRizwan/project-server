import { FilterQuery, ObjectId } from "mongoose";
import { Iuser } from "../../domain/entities/user/user";
import userModel from "../database/models/userModel";
import { CustomError } from "../../domain/errors/customError";

export class UserRepository {
  async createUser(user: Iuser): Promise<Iuser> {
    const userCreate = await userModel.create(user);
    const userData: Iuser = {
      ...(userCreate.toObject() as unknown as Iuser),
      _id: userCreate._id.toString(),
    };
    return userData;
  }
  async findUserByEmail(email: string): Promise<Iuser | null> {
    const user = await userModel.findOne({ email });
    if (!user) {
      return user;
    }
    const userData: Iuser = {
      ...(user.toObject() as unknown as Iuser),
      _id: user._id.toString(),
    };
    return userData;
  }
  async verifyuser(email: string): Promise<Iuser | null> {
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { $set: { is_verified: true } },
      { new: true }
    );
    if (!updatedUser) {
      return null;
    }
    const userData: Iuser = {
      ...(updatedUser.toObject() as unknown as Iuser),
      _id: updatedUser._id.toString(),
    };
    return userData;
  }
  async changePassword(email: string, password: string) {
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { $set: { password: password } },
      { new: true }
    );
    if (!updatedUser) {
      return null;
    }
    const userData: Iuser = {
      ...(updatedUser.toObject() as unknown as Iuser),
      _id: updatedUser._id.toString(),
    };

    return userData;
  }
  async getAllUsersData(
    query: FilterQuery<Iuser>,
    page: number,
    limit: number,
    filterData: object
  ): Promise<Iuser[] | null> {
    console.log(filterData);
    const completeQuery = { ...query, ...filterData };
    const users = await userModel
      .find(completeQuery)
      .skip((page - 1) * limit)
      .limit(limit).sort({ createdAt: -1 });
    return users.map((user) => {
      const userData: Iuser = {
        ...(user.toObject() as unknown as Iuser),
        _id: user._id.toString(),
      };
      return userData;
    });
  }
  async changeUserStatus(
    id: ObjectId,
    is_block: boolean
  ): Promise<Iuser | null> {
    const updatedUser: Iuser | null = await userModel.findOneAndUpdate(
      { _id: id },
      { $set: { is_block } },
      { new: true }
    );
    return updatedUser;
  }
  async getUser(id: string): Promise<Iuser | null> {
    try {
      const user: Iuser | null = await userModel.findById(id);
      if (!user) {
        throw new CustomError("user not found", 404);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    try {
      const updatedUser: Iuser | null = await userModel.findOneAndUpdate(
        { _id: id },
        { $set: { refreshToken } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }
  async countUsers(
    query: FilterQuery<Iuser>,
    filterData: object
  ): Promise<number> {
    const completedQuery = { ...query, ...filterData };
    return await userModel.countDocuments(completedQuery);
  }
  async updateProfile(id: string, userData: Iuser): Promise<Iuser | null> {
    try {
      const user: Iuser | null = await userModel.findOneAndUpdate(
        { _id: id },
        { $set: userData },
        { new: true }
      );
      if (!user) {
        throw new CustomError("user not found", 404);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  async updatePassword(id: string, password: string): Promise<Iuser | null> {
    try {
      const user: Iuser | null = await userModel.findOneAndUpdate(
        { _id: id },
        { $set: { password } },
        { new: true }
      );
      if (!user) {
        throw new CustomError("user not found", 404);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
