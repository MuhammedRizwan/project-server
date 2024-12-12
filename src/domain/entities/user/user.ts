import { ObjectId } from "mongoose";

export interface Iuser {
  _id?: string;
  username: string;
  lastname?: string;
  email: string;
  phone?: string;
  password: string;
  address?: string;
  friends?: string[];
  is_verified?: boolean;
  is_block?: boolean;
  profile_picture?: string;
  refreshToken?: string;
}

export interface UserRepository {
  createUser(user: Iuser): Promise<Iuser>;
  findUserByEmail(email: string): Promise<Iuser | null>;
  updateRefreshToken(
    id: string | undefined,
    refreshToken: string
  ): Promise<void>;
  getUser(id: string): Promise<Iuser | null>;
  updateProfile(userId: string, userData: Iuser): Promise<Iuser | null>;
  updatePassword(userId: string, HashedPssword: string): Promise<Iuser | null>;
  getAllUsersData(
    query: object,
    page: number,
    limit: number,
    filterData: object
  ): Promise<Iuser[] | null>;
  changeUserStatus(id: ObjectId, is_block: boolean): Promise<Iuser | null>;
  countUsers(query: object, filterData: object): Promise<number>;
  getContacts(
    query: object,
    userId: string | undefined
  ): Promise<Iuser[] | null>;
  findUserByEmail(email: string): Promise<Iuser | null>;
  verifyuser(email: string): Promise<Iuser | null>;
  changePassword(email: string, password: string): Promise<Iuser | null>;
  getUser(id: string): Promise<Iuser | null>;
  getAllUsersCount(): Promise<{
    usercount: number;
    unblockeduser: number;
  }>;
}
