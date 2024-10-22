export interface Iagent {
  _id?: string;
  agency_name?: string;
  email: string;
  phone?: string;
  location: string;
  password: string;
  document?: Express.Multer.File;
  DocumentURL?: string;
  is_verified?: boolean;
  admin_verified?: string;
  is_block?: boolean;
  profile_picture?: string|null;
  refreshToken?: string;
}
