import { UserUseCase } from "../../application/usecases/user";
import { Verification } from "../../application/usecases/user/userVerification";
import { UserRepository } from "../../adapters/repositories/userRepositories";
import { OTPRepository } from "../../adapters/repositories/otpRepositories";
import { WalletRepository } from "../../adapters/repositories/walletRepository";
import { EmailService } from "../services/emailService";
import { PasswordService } from "../services/passwordService";
import { GenerateOtp } from "../services/genarateOTP";
import { JwtService } from "../services/jwtService";

const Repositories = {
    UserRepository: new UserRepository(), 
    OTPRepository: new OTPRepository(),
    WalletRepository:new WalletRepository()
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