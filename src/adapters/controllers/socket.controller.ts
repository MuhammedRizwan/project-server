import { Server, Socket } from "socket.io";
import { SocketUseCase } from "../../application/usecases/socket";
import INotification from "../../domain/entities/notification/notification";
import SocketEvent from "../../domain/enum/socketevent";

interface Dependencies {
  useCase: {
    SocketUseCase: SocketUseCase;
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
    this._socketUseCase = dependencies.useCase.SocketUseCase;
    this._userSocketMap = new Map();
    this._agentSocketMap = new Map();
    this._adminSocketMap = new Map();
  }

  onConnection(socket: Socket) {
    console.log(`Client connected: ${socket.handshake.query.userId}`);
    const userId = socket.handshake.query.userId as string;
    const role = socket.handshake.query.role as string;
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

    socket.emit(
      SocketEvent.GetOnlineUsers,
      Array.from(this._userSocketMap.keys())
    );

    socket.on(SocketEvent.JoinedRoom, async (roomId) => {
      socket.join(roomId);
    });

    socket.on(SocketEvent.Message, async (data) => {
      const {
        roomId,
        recieverId,
        senderId,
        message,
        message_type,
        message_time,
      } = data;
      const savedMessage = await this._socketUseCase.saveMessage(
        roomId,
        senderId,
        message,
        message_time,
        message_type
      );
      const toSocketId = this._userSocketMap.get(recieverId);
      if (toSocketId) {
        this._io.to(toSocketId).emit(SocketEvent.NewBadge, savedMessage);
      }
      this._io
        .to(String(savedMessage.chatId))
        .emit(SocketEvent.NewMessage, savedMessage);
    });

    socket.on(SocketEvent.InitiateVideoCall, ({ to, signalData, myId }) => {
      const toSocketId = this._userSocketMap.get(to);
      if (toSocketId) {
        this._io
        .to(toSocketId)
          .emit(SocketEvent.IncomingVideoCall, { signalData, from: myId });
      }
    });

    socket.on(SocketEvent.AnswerVideoCall, (data) => {
      const toSocketId = this._userSocketMap.get(data.to);
      if (toSocketId) {
        this._io.to(toSocketId).emit(SocketEvent.AcceptVideoCall, data.signal);
      }
    });

    socket.on(SocketEvent.EndVideoCall, ({ to }) => {
      const toSocketId = this._userSocketMap.get(to);
      if (toSocketId) {
        this._io.to(toSocketId).emit(SocketEvent.VideoCallEnded);
      }
    });

    socket.on(SocketEvent.AudioMute, ({ isMuted, reciever }) => {
      const toSocketId = this._userSocketMap.get(reciever);
      if (toSocketId) {
        socket.to(toSocketId).emit(SocketEvent.AudioMuted, { isMuted });
      }
    });

    socket.on(SocketEvent.VideoMute, ({ isMuted, reciever }) => {
      const toSocketId = this._userSocketMap.get(reciever);
      if (toSocketId) {
        socket.to(toSocketId).emit(SocketEvent.VideoMuted, { isMuted });
      }
    });

    socket.on(SocketEvent.ToTheAdmin, async (data) => {
      const Notification = await this._socketUseCase.saveAdminNotification(
        data
      );
      this.emitToAdmins(SocketEvent.ShowNotification, Notification);
    });

    socket.on(SocketEvent.ToTheAgent, async (data) => {
      const Notification = await this._socketUseCase.saveNotification(data);
      const toSocketId = this._agentSocketMap.get(Notification.to);
      if (toSocketId) {
        this._io
          .to(toSocketId)
          .emit(SocketEvent.ShowNotification, Notification);
      }
    });

    socket.on(SocketEvent.ToAgents, async (data) => {
      const Notification = await this._socketUseCase.saveNotification(data);
      for (const [_, socketId] of this._agentSocketMap) {
        this._io.to(socketId).emit(SocketEvent.ShowNotification, Notification);
      }
    });

    socket.on(SocketEvent.ToUsers, async (data) => {
      const Notification = await this._socketUseCase.saveNotification(data);
      for (const [_, socketId] of this._userSocketMap) {
        this._io.to(socketId).emit(SocketEvent.ShowNotification, Notification);
      }
    });

    socket.on(SocketEvent.ToTheUser, async (data) => {
      const Notification = await this._socketUseCase.saveNotification(data);
      const toSocketId = this._userSocketMap.get(Notification.to);
      if (toSocketId) {
        this._io
          .to(toSocketId)
          .emit(SocketEvent.ShowNotification, Notification);
      }
    });

    socket.on("disconnect", () => {
      this.removeSocket(userId, role);
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

  emitToAdmins(event: string, data: INotification) {
    for (const [_, socketId] of this._adminSocketMap) {
      this._io.to(socketId).emit(event, data);
    }
  }
}
