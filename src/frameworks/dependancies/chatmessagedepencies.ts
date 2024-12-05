import ChatRepository from "../../adapters/repositories/chat.repository";
import { UserRepository } from "../../adapters/repositories/user.repositories";
import { ChatmessageUseCase } from "../../application/usecases/chatmessage";
import { CloudinaryService } from "../services/cloudinaryService";

const Repositories = {
  ChatRepository: new ChatRepository(),
  UserRepository:new UserRepository()
};
const Services = {
  CloudinaryService: new CloudinaryService(),
};

const UseCase = {
  ChatmessageUseCase: new ChatmessageUseCase({ Repositories, Services }),
};

const ChatmessageDependencies = {
  UseCase,
};

export default ChatmessageDependencies;
