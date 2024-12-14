export interface EmailService {
  sendVerificationEmail(email: string, otp: string): Promise<void>;
  sendAcceptanceEmail(email: string): Promise<void>;
  sendRejectionEmail(email: string): Promise<void>;
}

export interface JwtService {
  verifyRefreshToken(refreshToken: string): any;
  generateAccessToken(userId: string | undefined): string;
  generateRefreshToken(userId: string | undefined): string;
}

export interface GenerateOtp {
  generate(): string;
}
export interface PasswordService {
  passwordHash(password: string): Promise<string>;
  verifyPassword(password: string, userPassword: string): Promise<boolean>;
}

export interface CloudinaryService {
    uploadImage(file: Express.Multer.File | undefined): Promise<string>;
    uploadPDF(file: Express.Multer.File): Promise<string>;
    deleteImage(publicId: string): Promise<void>;
    updateImage(file: Express.Multer.File|undefined, oldPublicId: string): Promise<string>;
  }

  

