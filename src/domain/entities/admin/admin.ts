
export interface Iadmin {
  _id?: string ;
  admin_name?: string;
  email: string;
  phone?: string;
  password: string;
  refreshToken?: string;
}

export interface AdminRepository {
  changePassword(email: string, password: string): unknown;
  findAdminByEmail(email: string): Promise<Iadmin | null>;
  getAdmin(id: string): Promise<Iadmin | null>;
  addRefreshToken(id: string | undefined, refreshToken: string): Promise<void>;
}
