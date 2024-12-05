import { UserUseCase } from "../../application/usecases/user";
import { Verification } from "../../application/usecases/user/userVerification";
import { UserRepository } from "../../adapters/repositories/user.repositories";
import { OTPRepository } from "../../adapters/repositories/otp.repositories";
import { WalletRepository } from "../../adapters/repositories/wallet.repository";
import { EmailService } from "../services/emailService";
import { PasswordService } from "../services/passwordService";
import { GenerateOtp } from "../services/genarateOTP";
import { JwtService } from "../services/jwtService";
import { CloudinaryService } from "../services/cloudinaryService";

const Repositories = {
    UserRepository: new UserRepository(), 
    OTPRepository: new OTPRepository(),
    WalletRepository:new WalletRepository()
};
const services={
    EmailService:new EmailService(),
    PasswordService:new PasswordService(),
    GenerateOtp:new GenerateOtp(),
    JwtService:new JwtService(),
    CloudinaryService:new CloudinaryService()
}


const UseCase = {
    UserUseCase: new UserUseCase({ Repositories ,services}), 
    Verification:new Verification({Repositories,services}) 
};

const UserDependancies = {
    UseCase,
}

export default UserDependancies;