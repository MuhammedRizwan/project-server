import { AdminRepository } from "../../adapters/repositories/admin.repository";
import { AgentRepository } from "../../adapters/repositories/agent.repository";
import { OTPRepository } from "../../adapters/repositories/otp.repositories";
import { UserRepository } from "../../adapters/repositories/user.repositories";
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