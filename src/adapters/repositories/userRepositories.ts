import { FilterQuery, ObjectId } from "mongoose";
import { Iuser } from "../../domain/entities/user/user";
import userModel from "../database/models/userModel";
import { CustomError } from "../../domain/errors/customError";

export class MongoUserRepository {
  async createUser(user: Iuser): Promise<Iuser> {
    const userCreate = await userModel.create(user);
    if (!userCreate) {
      return userCreate;
    }
    const userData: Iuser = {
      ...(userCreate.toObject() as unknown as Iuser),
      _id: userCreate._id as string,
    };
    return userData
  }
  async findUserByEmail(email: string): Promise<Iuser | null> {
    const user = await userModel.findOne({ email });
    if (!user) {
      return user;
    }
    const userData: Iuser = {
      ...(user.toObject() as unknown as Iuser),
      _id: user._id as string,
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
      _id: updatedUser._id as string,
    };
    return userData;
  }
  async changePassword(email:string,password:string){
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
      _id: updatedUser._id as string,
    };

    return userData;
  }
 async getAllUsersData(query:FilterQuery<Iuser>,page:number,limit:number):Promise<Iuser[]|null>{
  const users = await userModel.find(query).skip((page - 1) * limit).limit(limit);
  return users.map((user) => {
    const userData: Iuser = {
      ...(user.toObject() as unknown as Iuser),
      _id: user._id as string,
    };
    return userData;
  })
  }
  async changeUserStatus(id:ObjectId,is_block:boolean):Promise<Iuser|null>{
    const updatedUser:Iuser|null = await userModel.findOneAndUpdate(
      { _id:id },
      { $set: { is_block} },
      { new: true }
    );
    return updatedUser;
  }
  async getUser(id:string):Promise<Iuser|null>{
    try {
      const user:Iuser|null = await userModel.findById(id);
      if(!user){
        throw new CustomError("user not found",404)
      }
      return user
    } catch (error) {
      throw error
    }
  }
  async updateRefreshToken(id:string,refreshToken:string):Promise<void>{
    try {
      const updatedUser:Iuser|null = await userModel.findOneAndUpdate(
        { _id:id },
        { $set: { refreshToken} },
        { new: true }
      );
    } catch (error) {
      throw error
    }
  }
  async countUsers(query:FilterQuery<Iuser>):Promise<number>{
    return await userModel.countDocuments(query)
  } 
}
