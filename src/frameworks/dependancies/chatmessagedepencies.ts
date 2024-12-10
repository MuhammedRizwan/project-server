import ChatRepository from "../../adapters/repositories/chat.repository";
import { UserRepository } from "../../adapters/repositories/user.repositories";
import { ChatmessageUseCase } from "../../application/usecases/chatmessage";

const Repositories = {
  ChatRepository: new ChatRepository(),
  UserRepository:new UserRepository()
};

const UseCase = {
  ChatmessageUseCase: new ChatmessageUseCase({ Repositories }),
};

const ChatmessageDependencies = {
  UseCase,
};

export default ChatmessageDependencies;
