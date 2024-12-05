import { AgentRepository } from "../../adapters/repositories/agent.repository";
import { OTPRepository } from "../../adapters/repositories/otp.repositories";
import { AgentUseCase } from "../../application/usecases/agent";
import { AgentVerification } from "../../application/usecases/agent/agentVerifcation";
import { CloudinaryService } from "../services/cloudinaryService";
import { EmailService } from "../services/emailService";
import { GenerateOtp } from "../services/genarateOTP";
import { JwtService } from "../services/jwtService";
import { PasswordService } from "../services/passwordService";

const Repositories={
AgentRepository:new AgentRepository(),
OTPRepository:new OTPRepository()
}
const Services={
    EmailService:new EmailService(),
    PasswordService:new PasswordService(),
    GenerateOtp:new GenerateOtp(),
    JwtService:new JwtService(),
    CloudinaryService:new CloudinaryService()
}

const useCase={
    AgentUseCase:new AgentUseCase({Repositories,Services}),
    AgentVerification:new AgentVerification({Repositories,Services})

}

const AgentDepencies={
    useCase
}
export default AgentDepencies