import { MongoAdminRepository } from "../../adapters/repositories/adminRepository";
import { MongoAgentRepository } from "../../adapters/repositories/agentRepository";
import { MongoOTPRepository } from "../../adapters/repositories/otpRepositories";
import { MongoUserRepository } from "../../adapters/repositories/userRepositories";
import { AdminUseCase } from "../../application/usecases/admin";
import { EmailService } from "../services/emailService";
import { GenerateOtp } from "../services/genarateOTP";
import { JwtService } from "../services/jwtService";

const Repositories={
MongoAdminRepository:new MongoAdminRepository(),
MongoOTPRepository:new MongoOTPRepository(),
MongoUserRepository:new MongoUserRepository(),
MongoAgentRepository:new MongoAgentRepository()
}
const Services={
    EmailService:new EmailService(),
    GenerateOtp:new GenerateOtp(),
    JwtService:new JwtService()
}
const useCase={
    AdminUseCase:new AdminUseCase({Repositories,Services}),
}

const AdminDepencies={
    useCase
}
export default AdminDepencies