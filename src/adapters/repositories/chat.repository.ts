import Chat, { Message } from "../../domain/entities/chat/chat";
import chatModel from "../database/models/chat.model";
import MessageModel from "../database/models/message.model";

export default class ChatRepository {
  async saveMessage(
    roomId: string,
    senderId: string,
    message: string,
    message_type: string,
  ) {
    try {
      const newMessage = await MessageModel.create({
        chatId: roomId,
        senderId: senderId,
        message: message,
        message_type: message_type,
      });

      await chatModel.findByIdAndUpdate(
        roomId,
        {
          $push: { messages: newMessage._id },
          $set: { lastMessage: newMessage._id },
        },
        { new: true }
      );
      return newMessage as unknown as Message;
    } catch (error) {
      throw error;
    }
  }

  async getMessagesByRoom(roomId: string): Promise<Chat> {
    try {
      const room = await chatModel
        .findById(roomId)
        .populate({
          path: "messages",
          populate: {
            path: "senderId",
            select: "_id username email profile_picture",
          },
        }) 

      if (!room) {
        throw new Error("Room not found");
      }

      // Check if messages array is empty
      if (room.messages.length === 0) {
        console.log("No messages found for this room.");
        return { ...room.toObject(), messages: [] } as unknown as Chat; // Return the room with an empty messages array
      }

      return room as unknown as Chat;
    } catch (error) {
      console.error("Error fetching room messages:", error);
      throw error;
    }
  }

  async getRoom(recieverId: string, senderId: string): Promise<Chat | null> {
    try {
      const room = await chatModel.findOne({
        participants: { $all: [recieverId, senderId] }, // Ensure both IDs exist in participants
      });
      return room as unknown as Chat;
    } catch (error) {
      throw error;
    }
  }
  async createRoom(recieverId: string, senderId: string): Promise<Chat> {
    try {
      const room = await chatModel.create({
        participants: [recieverId, senderId],
      });
      return room as unknown as Chat;
    } catch (error) {
      throw error;
    }
  }
  async getRoomById(roomId: string): Promise<Chat | null> {
    try {
      const room = await chatModel
        .findById(roomId)
        .populate("participants", "_id username email profile_picture")
        .populate("messages")
      return room as unknown as Chat;
    } catch (error) {
      throw error;
    }
  }
}
