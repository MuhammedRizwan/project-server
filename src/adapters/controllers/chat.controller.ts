import { Server, Socket } from "socket.io";
import { ChatUseCase } from "../../application/usecases/chat";

interface Dependencies {
  UseCase: {
    ChatUseCase: ChatUseCase;
  };
}

export default class ChatController {
  private io: Server;
  private chatUseCase: ChatUseCase;
  private userSocketMap: Map<string, string>;

  constructor(io: Server, dependencies: Dependencies) {
    this.io = io;
    this.chatUseCase = dependencies.UseCase.ChatUseCase;
    this.userSocketMap = new Map();
  }

  onConnection(socket: Socket) {
    console.log(`Client connected: ${socket.handshake.query.userId}`);
    const userId=socket.handshake.query.userId
    this.userSocketMap.set(userId as string, socket.id);

    socket.on("joined-room", async (roomId) => {
      socket.join(roomId);
    });
    socket.on("message", async ({ roomId,recieverId, senderId, message,message_type,message_time }) => {
      const savedMessage = await this.chatUseCase.saveMessage(
        roomId,
        senderId,
        message,
        message_time,
        message_type
      );
      const toSocketId = this.userSocketMap.get(recieverId);
      if (toSocketId) {
        this.io.to(toSocketId).emit("new-badge",savedMessage)
      }
      this.io.to(String(savedMessage.chatId)).emit("new-message", savedMessage);
    });
    socket.on("initiate-video-call", ({ to, signalData, myId }) => {
      const toSocketId = this.userSocketMap.get(to);
      if (!toSocketId) return;
      this.io
        .to(toSocketId)
        .emit("incomming-video-call", { signalData, from: myId });
    });

    socket.on("answer-video-call", (data) => {
      const toSocketId = this.userSocketMap.get(data.to);
      if (toSocketId) {
        this.io.to(toSocketId).emit("accept-video-call", data.signal);
      }
    });

    socket.on("end-video-call", ({ to }) => {
      const toSocketId = this.userSocketMap.get(to);
      if (toSocketId) {
        this.io.to(toSocketId).emit("video-call-ended");
      }
    });
    socket.on("audio-mute", ({ isMuted, reciever }) => {
      const toSocketId = this.userSocketMap.get(reciever);
      if (toSocketId) {
        socket.to(toSocketId).emit("audio-muted", { isMuted });
      }
    });

    socket.on("video-mute", ({ isMuted, reciever }) => {
      const toSocketId = this.userSocketMap.get(reciever);
      if (toSocketId) {
        socket.to(toSocketId).emit("video-muted", { isMuted });
      }
    });
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  }
}
