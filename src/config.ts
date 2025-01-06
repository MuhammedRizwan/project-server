import dotenv from "dotenv";
dotenv.config();

const configKeys = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL as string,
  MONGODB: process.env.MONGODB as string,
  MAIL_SERVICE: process.env.MAIL_SERVICE as string,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
  ADMIN_ID: process.env.ADMIN_ID as string,
  ADMIN_COMMISION: process.env.ADMIN_COMMISION as string,
  FRONT_URL: process.env.FRONT_URL as string,
};
export default configKeys;
