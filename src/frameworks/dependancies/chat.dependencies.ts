import ChatRepository from "../../adapters/repositories/chat.repository";
import { ChatUseCase } from "../../application/usecases/chat";
import { CloudinaryService } from "../services/cloudinaryService";


const Repositories = {
  ChatRepository: new ChatRepository(),
};
const Services={
    CloudinaryService:new CloudinaryService()
}

const UseCase = {
  ChatUseCase: new ChatUseCase({Repositories,Services }),
};

const ChatDependencies = {
  UseCase
};

export default ChatDependencies;
