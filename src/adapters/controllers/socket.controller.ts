import { Server, Socket } from "socket.io";
import { SocketUseCase } from "../../application/usecases/socket";


interface Dependencies {
  useCase: {
    ChatUseCase: SocketUseCase;
  };
}

export default class SocketController {
  private _io: Server;
  private _socketUseCase: SocketUseCase;
  private _userSocketMap: Map<string, string>;
  private _agentSocketMap: Map<string, string>;
  private _adminSocketMap: Map<string, string>;

  constructor(io: Server, dependencies: Dependencies) {
    this._io = io;
    this._socketUseCase = dependencies.useCase.ChatUseCase;
    this._userSocketMap = new Map();
    this._agentSocketMap = new Map();
    this._adminSocketMap = new Map();
  }

  onConnection(socket: Socket) {
    console.log(`Client connected: ${socket.handshake.query.userId}`);
    const userId = socket.handshake.query.userId;
    const role = socket.handshake.query.role;
    switch (role) {
      case "user":
        this._userSocketMap.set(userId as string, socket.id);
        socket.join("user-room");
        break;
      case "agent":
        this._agentSocketMap.set(userId as string, socket.id);
        socket.join("agent-room");
        break;
      case "admin":
        this._adminSocketMap.set(userId as string, socket.id);
        socket.join("admin-room");
        break;
      default:
        console.error(`Invalid role: ${role}`);
        return;
    }

    socket.emit("get-online-users", Array.from(this._userSocketMap.keys()));

    socket.on("joined-room", async (roomId) => {
      socket.join(roomId);
    });
    socket.on(
      "message",
      async ({
        roomId,
        recieverId,
        senderId,
        message,
        message_type,
        message_time,
      }) => {
        const savedMessage = await this._socketUseCase.saveMessage(
          roomId,
          senderId,
          message,
          message_time,
          message_type
        );
        const toSocketId = this._userSocketMap.get(recieverId);
        if (toSocketId) {
          this._io.to(toSocketId).emit("new-badge", savedMessage);
        }
        this._io
          .to(String(savedMessage.chatId))
          .emit("new-message", savedMessage);
      }
    );
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
      this.removeSocket(userId as string, role as string);
    });
  }
  private removeSocket(userId: string, role: string) {
    switch (role) {
      case "user":
        this._userSocketMap.delete(userId);
        break;
      case "agent":
        this._agentSocketMap.delete(userId);
        break;
      case "admin":
        this._adminSocketMap.delete(userId);
        break;
      default:
        console.error(`Invalid role: ${role}`);
    }
  }
  emitToAdmins(event: string, data: any) {
    for (const [_, socketId] of this._adminSocketMap) {
      this._io.to(socketId).emit(event, data);
    }
  }
  emitToUsers(event: string, data: any) {
    for (const [_, socketId] of this._userSocketMap) {
      this._io.to(socketId).emit(event, data);
    }
  }
  emitToAgents(event: string, data: any) {
    for (const [_, socketId] of this._agentSocketMap) {
      this._io.to(socketId).emit(event, data);
    }
  }
  emitToUser(event: string, data: any, userId: string) {
    const toSocketId = this._userSocketMap.get(userId);
    if (toSocketId) {
      this._io.to(toSocketId).emit(event, data);
    }
  }
  emitToAgent(event: string, data: any, userId: string) {
    const toSocketId = this._agentSocketMap.get(userId);
    if (toSocketId) {
      this._io.to(toSocketId).emit(event, data);
    }
  }
}
