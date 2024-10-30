
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
