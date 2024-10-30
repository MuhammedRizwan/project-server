import { UserUseCase } from "../../application/usecases/user";
import { Verification } from "../../application/usecases/user/userVerification";
import { MongoUserRepository } from "../../adapters/repositories/userRepositories";
import { MongoOTPRepository } from "../../adapters/repositories/otpRepositories";
import { MongoWalletRepository } from "../../adapters/repositories/walletRepository";
import { EmailService } from "../services/emailService";
import { PasswordService } from "../services/passwordService";
import { GenerateOtp } from "../services/genarateOTP";
import { JwtService } from "../services/jwtService";

const Repositories = {
    MongoUserRepository: new MongoUserRepository(), 
    MongoOTPRepository: new MongoOTPRepository(),
    MongoWalletRepository:new MongoWalletRepository()
};
const services={
    EmailService:new EmailService(),
    PasswordService:new PasswordService(),
    GenerateOtp:new GenerateOtp(),
    JwtService:new JwtService()
}


const UseCase = {
    UserUseCase: new UserUseCase({ Repositories ,services}), 
    Verification:new Verification({Repositories,services}) 
};

const UserDependancies = {
    UseCase,
}

export default UserDependancies;