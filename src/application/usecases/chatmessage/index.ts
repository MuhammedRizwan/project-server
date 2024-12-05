import Chat from "../../../domain/entities/chat/chat";
import { Iuser } from "../../../domain/entities/user/user";
import { CustomError } from "../../../domain/errors/customError";

interface CloudinaryService {
  uploadImage(file: Express.Multer.File | undefined): Promise<string>;
}
interface UserRepository {
  getContacts(query: object,userId:string|undefined): Promise<Iuser[]|null>;
}
interface ChatRepository {
  getRoom(recieverId: string, senderId: string): Promise<Chat|null>;
  createRoom(recieverId: string, senderId: string): Promise<Chat>;
  getRoomById(roomId: string): Promise<Chat|null>;
}

interface Dependencies {
  Repositories: {
    ChatRepository: ChatRepository;
    UserRepository: UserRepository;
  };
  Services: {
    CloudinaryService: CloudinaryService;
  };
}
export class ChatmessageUseCase {
  private chatRepository: ChatRepository;
  private cloudinaryService: CloudinaryService;
  private userRepository: UserRepository;
  constructor(dependencies: Dependencies) {
    this.chatRepository = dependencies.Repositories.ChatRepository;
    this.cloudinaryService = dependencies.Services.CloudinaryService;
    this.userRepository = dependencies.Repositories.UserRepository;
  }
  async getContacts(search: string,userId:string|undefined) {
    try {
        const query = search ? { username: { $regex: search, $options: "i" } } : {};
      const users = await this.userRepository.getContacts(query,userId);
      if (!users) {
        throw new CustomError("No users found", 404);
      }
      return users;
    } catch (error) {
      throw error;
    }
  }
  async getRoom(recieverId: string, senderId: string) {
    try {
      let room = await this.chatRepository.getRoom(recieverId, senderId);
      if (!room) {
        room=await this.chatRepository.createRoom(recieverId, senderId);
      }
      return room;
    } catch (error) {
      throw error;
    }
  }
  async getRoomMessage(roomId: string) {
    try {
      const room = await this.chatRepository.getRoomById(roomId);
      if (!room) {
        throw new CustomError("No room found", 404);
      }
      
      return room;
    } catch (error) {
      throw error;
    }
  }
}
