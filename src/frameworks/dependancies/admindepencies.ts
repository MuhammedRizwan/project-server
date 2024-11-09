import { AdminRepository } from "../../adapters/repositories/adminRepository";
import { AgentRepository } from "../../adapters/repositories/agentRepository";
import { OTPRepository } from "../../adapters/repositories/otpRepositories";
import { UserRepository } from "../../adapters/repositories/userRepositories";
import { AdminUseCase } from "../../application/usecases/admin";
import { EmailService } from "../services/emailService";
import { GenerateOtp } from "../services/genarateOTP";
import { JwtService } from "../services/jwtService";

const Repositories={
AdminRepository:new AdminRepository(),
OTPRepository:new OTPRepository(),
UserRepository:new UserRepository(),
AgentRepository:new AgentRepository()
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