import Chat, { Message } from "../../../domain/entities/chat/chat";
import { CustomError } from "../../../domain/errors/customError";

interface ChatRepository {
  saveMessage(
    roomId: string,
    senderId: string,
    message: string,
    message_type: string,
  ): Promise<Message>;
  getMessagesByRoom(roomId: string): Promise<Chat>;
}
interface CloudinaryService {
  uploadImage(file: Express.Multer.File | undefined): Promise<string>;
}
interface Dependencies {
  Repositories: {
    ChatRepository: ChatRepository;
  };
  Services: {
    CloudinaryService: CloudinaryService;
  };
}
export class ChatUseCase {
  private chatRepository: ChatRepository;
  private cloudinaryService: CloudinaryService;
  constructor(dependencies: Dependencies) {
    this.chatRepository = dependencies.Repositories.ChatRepository;
    this.cloudinaryService = dependencies.Services.CloudinaryService;
  }
  async saveMessage( roomId: string, senderId: string, message: string,message_type: string) {
    try {
        const savedMessage = await this.chatRepository.saveMessage( roomId, senderId, message,message_type );
        if(!savedMessage){
            throw new CustomError("message not saved", 500)
        }
        return savedMessage
    } catch (error) {
        throw error
    }
  }
}
