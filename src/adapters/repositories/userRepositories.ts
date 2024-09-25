import { ObjectId } from "mongoose";
import { Iuser } from "../../domain/entities/user/user";
import userModel from "../database/models/userModel";

export class MongoUserRepository {
  async createUser(user: Iuser): Promise<Iuser> {
    const userCreate = await userModel.create(user);
    if (!userCreate) {
      return userCreate;
    }
    const userData: Iuser = {
      ...(userCreate.toObject() as unknown as Iuser),
      _id: userCreate._id as ObjectId,
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
      _id: user._id as ObjectId,
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
      _id: updatedUser._id as ObjectId,
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
      _id: updatedUser._id as ObjectId,
    };
    return userData;
  }
 async getAllUsersData():Promise<Iuser[]|null>{
  const users:Iuser[]=await userModel.find();
  return users
  }
  async changeUserStatus(id:ObjectId,is_block:boolean):Promise<Iuser|null>{
    const updatedUser:Iuser|null = await userModel.findOneAndUpdate(
      { _id:id },
      { $set: { is_block} },
      { new: true }
    );
    return updatedUser;
  }
}
