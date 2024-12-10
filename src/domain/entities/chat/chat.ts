import { Iuser } from "../user/user";

export default interface Chat {
    _id:string
    participants: string[]|Iuser[];
    messages: string[]|Message[];
    lastMessage:string|Message; 
  }
  export interface Message {
    _id:string
    chatId: string;
    senderId: string;
    message: string;
    message_type: 'text' | 'image';
    message_time:Date
  }

  export interface ChatRepository {
    saveMessage(
      roomId: string,
      senderId: string,
      message: string,
      message_time:Date,
      message_type: string,
    ): Promise<Message>;
    getMessagesByRoom(roomId: string): Promise<Chat>;
    getRoom(recieverId: string, senderId: string): Promise<Chat | null>;
    createRoom(recieverId: string, senderId: string): Promise<Chat>;
    getRoomById(roomId: string,userId:string): Promise<Chat | null>;
    getChats(query: object, userId: string | undefined): Promise<Chat[] | null>;
    getUnreadMessageCount(
      chatId: string,
      userId: string | undefined
    ): Promise<number>;
  }
  