import { ObjectId } from "mongoose";
import { Iuser } from "../../domain/entities/user/user";
import userModel from "../database/models/userModel";

export class MongoUserRepository {
  async createUser(user: Iuser):Promise<Iuser> {
    const userCreate = await userModel.create(user);
    const userData: Iuser = {
      ...userCreate.toObject() as unknown as Iuser,  
      _id: userCreate._id as ObjectId,
    };
    return userData;
  }
  async findUserByEmail(email: string):Promise<Iuser | null>{
    const user = await userModel.findOne({ email });
    if(!user){
      return user
    }
    const userData: Iuser = {
      ...user.toObject() as unknown as Iuser,  
      _id: user._id as ObjectId,
    };
    return userData
  }
}
