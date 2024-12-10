import { ChatRepository, Message } from "../../../domain/entities/chat/chat";
import { Dependencies } from "../../../domain/entities/depencies/depencies";
import { Iuser, UserRepository } from "../../../domain/entities/user/user";
import { CustomError } from "../../../domain/errors/customError";


export class ChatmessageUseCase {
  private _chatRepository: ChatRepository;
  private _userRepository: UserRepository;

  constructor(dependencies: Dependencies) {
    this._chatRepository = dependencies.Repositories.ChatRepository;
    this._userRepository = dependencies.Repositories.UserRepository;
  }

  async getContacts(search: string, userId: string | undefined) {
    try {
      const query = search
        ? { username: { $regex: search, $options: "i" } }
        : {};
      const users = await this._userRepository.getContacts(query, userId);
      if (!users) {
        throw new CustomError("No users found", 404);
      }
      return users;
    } catch (error) {
      throw error;
    }
  }

  async getChats(search: string, userId: string | undefined) {
    try {
      const query = search
        ? { username: { $regex: search, $options: "i" } }
        : {};
      const chats = await this._chatRepository.getChats(query, userId);
      if (!chats) {
        throw new CustomError("No users found", 404);
      }

      const result = await Promise.all(
        chats.map(async (chat) => {
          const unReadCount = await this._chatRepository.getUnreadMessageCount(
            chat._id,
            userId
          );
          const otherParticipant = chat.participants[0];
          return {
            _id: (otherParticipant as Iuser)?._id,
            chatId: chat._id,
            username: (otherParticipant as Iuser)?.username,
            profile_picture:
              (otherParticipant as Iuser)?.profile_picture || null,
            lastMessage: (chat.lastMessage as Message)?.message || null,
            unReadCount: unReadCount,
          };
        })
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getRoom(recieverId: string, senderId: string) {
    try {
      let room = await this._chatRepository.getRoom(recieverId, senderId);
      if (!room) {
        room = await this._chatRepository.createRoom(recieverId, senderId);
      }
      return room;
    } catch (error) {
      throw error;
    }
  }

  async getRoomMessage(roomId: string, userId: string) {
    try {
      const room = await this._chatRepository.getRoomById(roomId, userId);
      if (!room) {
        throw new CustomError("No room found", 404);
      }

      return room;
    } catch (error) {
      throw error;
    }
  }
}
