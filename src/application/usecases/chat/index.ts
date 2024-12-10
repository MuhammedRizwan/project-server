import { ChatRepository } from "../../../domain/entities/chat/chat";
import { CustomError } from "../../../domain/errors/customError";


interface Dependencies {
  Repositories: {
    ChatRepository: ChatRepository;
  };
}
export class ChatUseCase {
  private chatRepository: ChatRepository;
  constructor(dependencies: Dependencies) {
    this.chatRepository = dependencies.Repositories.ChatRepository;
  }
  async saveMessage( roomId: string, senderId: string, message: string,message_time:Date,message_type: string) {
    try {
        const savedMessage = await this.chatRepository.saveMessage( roomId, senderId, message,message_time,message_type );
        if(!savedMessage){
            throw new CustomError("message not saved", 500)
        }
        return savedMessage
    } catch (error) {
        throw error
    }
  }
}
