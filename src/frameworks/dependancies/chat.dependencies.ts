import ChatRepository from "../../adapters/repositories/chat.repository";
import { ChatUseCase } from "../../application/usecases/chat";

const Repositories = {
  ChatRepository: new ChatRepository(),
};

const UseCase = {
  ChatUseCase: new ChatUseCase({Repositories}),
};

const ChatDependencies = {
  UseCase
};

export default ChatDependencies;
