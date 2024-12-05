import { Iuser } from "../user/user";

export default interface Chat {
    _id:string
    participants: string[]|Iuser[];
    messages: string[]|Message[];
    lastMessage:string; 
  }
  export interface Message {
    _id:string
    chatId: string;
    senderId: string;
    message: string;
    message_type: 'text' | 'image';
    message_time:Date
  }