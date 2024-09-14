import dotenv from 'dotenv'
dotenv.config()

const configKeys={
    PORT:process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL as string,
    MONGODB:process.env.MONGODB as string,
    MAIL_SERVICE:process.env.MAIL_SERVICE as string,
    MAIL_PASSWORD:process.env.MAIL_PASSWORD as string,
    JWT_SECRET:process.env.JWT_SECRET as string,
    REFRESH_TOKEN_SECRET :process.env.REFRESH_TOKEN_SECRET as string

};
export default configKeys;