import { UserUseCase } from "../../application/usecases/user";
import { RefreshToken } from "../../application/usecases/refreshToken";
import { MongoUserRepository } from "../../adapters/repositories/userRepositories";
import { MongoOTPRepository } from "../../adapters/repositories/otpRepositories";
import { EmailService } from "../services/emailService";
import { PasswordService } from "../services/passwordService";
import { GenerateOtp } from "../services/genarateOTP";
import { JwtService } from "../services/jwtService";

const Repositories = {
    MongoUserRepository: new MongoUserRepository(), 
    MongoOTPRepository: new MongoOTPRepository()
};
const services={
    EmailService:new EmailService(),
    PasswordService:new PasswordService(),
    GenerateOtp:new GenerateOtp(),
    JwtService:new JwtService()
}
const TokenService={
    JwtService:new JwtService()
}

const UseCase = {
    UserUseCase: new UserUseCase({ Repositories ,services}), 
    RefreshToken:new RefreshToken({TokenService}) 
};

const UserDependancies = {
    UseCase,
}

export default UserDependancies;