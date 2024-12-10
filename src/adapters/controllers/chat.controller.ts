import { Server, Socket } from "socket.io";
import { ChatUseCase } from "../../application/usecases/chat";

interface Dependencies {
  useCase: {
    ChatUseCase: ChatUseCase;
  };
}

export default class ChatController {
  private _io: Server;
  private _chatUseCase: ChatUseCase;
  private _userSocketMap: Map<string, string>;

  constructor(io: Server, dependencies: Dependencies) {
    this._io = io;
    this._chatUseCase = dependencies.useCase.ChatUseCase;
    this._userSocketMap = new Map();
  }

  onConnection(socket: Socket) {
    console.log(`Client connected: ${socket.handshake.query.userId}`);
    const userId=socket.handshake.query.userId
    this._userSocketMap.set(userId as string, socket.id);
    console.log(this._userSocketMap);
    socket.emit('get-online-users', Array.from(this._userSocketMap.keys()));

    socket.on("joined-room", async (roomId) => {
      socket.join(roomId);
    });
    socket.on("message", async ({ roomId,recieverId, senderId, message,message_type,message_time }) => {
      const savedMessage = await this._chatUseCase.saveMessage(
        roomId,
        senderId,
        message,
        message_time,
        message_type
      );
      const toSocketId = this._userSocketMap.get(recieverId);
      if (toSocketId) {
        this._io.to(toSocketId).emit("new-badge",savedMessage)
      }
      this._io.to(String(savedMessage.chatId)).emit("new-message", savedMessage);
    });
    socket.on("initiate-video-call", ({ to, signalData, myId }) => {
      const toSocketId = this._userSocketMap.get(to);
      if (!toSocketId) return;
      this._io
        .to(toSocketId)
        .emit("incomming-video-call", { signalData, from: myId });
    });

    socket.on("answer-video-call", (data) => {
      const toSocketId = this._userSocketMap.get(data.to);
      if (toSocketId) {
        this._io.to(toSocketId).emit("accept-video-call", data.signal);
      }
    });

    socket.on("end-video-call", ({ to }) => {
      const toSocketId = this._userSocketMap.get(to);
      if (toSocketId) {
        this._io.to(toSocketId).emit("video-call-ended");
      }
    });
    socket.on("audio-mute", ({ isMuted, reciever }) => {
      const toSocketId = this._userSocketMap.get(reciever);
      if (toSocketId) {
        socket.to(toSocketId).emit("audio-muted", { isMuted });
      }
    });

    socket.on("video-mute", ({ isMuted, reciever }) => {
      const toSocketId = this._userSocketMap.get(reciever);
      if (toSocketId) {
        socket.to(toSocketId).emit("video-muted", { isMuted });
      }
    });
    socket.on("disconnect", () => {
      for (const [key, value] of this._userSocketMap.entries()) {
        if (value === socket.id) {
          console.log(`Removing userId: ${key} for socket.id: ${socket.id}`);
          this._userSocketMap.delete(key); 
          break;
        }
      }
    });
  }
}
