import { ChatRepository, Message } from "../../../domain/entities/chat/chat";
import { Iuser, UserRepository } from "../../../domain/entities/user/user";
import { CustomError } from "../../../domain/errors/customError";

interface Dependencies {
  Repositories: {
    ChatRepository: ChatRepository;
    UserRepository: UserRepository;
  };
}

export class ChatmessageUseCase {
  private chatRepository: ChatRepository;
  private userRepository: UserRepository;

  constructor(dependencies: Dependencies) {
    this.chatRepository = dependencies.Repositories.ChatRepository;
    this.userRepository = dependencies.Repositories.UserRepository;
  }

  async getContacts(search: string, userId: string | undefined) {
    try {
      const query = search
        ? { username: { $regex: search, $options: "i" } }
        : {};
      const users = await this.userRepository.getContacts(query, userId);
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
      const chats = await this.chatRepository.getChats(query, userId);
      if (!chats) {
        throw new CustomError("No users found", 404);
      }

      const result = await Promise.all(
        chats.map(async (chat) => {
          const unReadCount = await this.chatRepository.getUnreadMessageCount(
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
      let room = await this.chatRepository.getRoom(recieverId, senderId);
      if (!room) {
        room = await this.chatRepository.createRoom(recieverId, senderId);
      }
      return room;
    } catch (error) {
      throw error;
    }
  }

  async getRoomMessage(roomId: string, userId: string) {
    try {
      const room = await this.chatRepository.getRoomById(roomId, userId);
      if (!room) {
        throw new CustomError("No room found", 404);
      }

      return room;
    } catch (error) {
      throw error;
    }
  }
}
