import { ChatRepository } from "../../../domain/entities/chat/chat";
import { Dependencies } from "../../../domain/entities/depencies/depencies";
import { CustomError } from "../../../domain/errors/customError";

export class ChatUseCase {
  private _chatRepository: ChatRepository;
  constructor(dependencies: Dependencies) {
    this._chatRepository = dependencies.Repositories.ChatRepository;
  }
  async saveMessage( roomId: string, senderId: string, message: string,message_time:Date,message_type: string) {
    try {
        const savedMessage = await this._chatRepository.saveMessage( roomId, senderId, message,message_time,message_type );
        if(!savedMessage){
            throw new CustomError("message not saved", 500)
        }
        return savedMessage
    } catch (error) {
        throw error
    }
  }
}
