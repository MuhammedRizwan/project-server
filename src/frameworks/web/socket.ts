// Ioconfig.ts
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import ChatDependencies from "../dependancies/chat.dependencies";
import ChatController from "../../adapters/controllers/chat.controller";


const Ioconfig = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const socketController = new ChatController(io, ChatDependencies);

  io.on("connection", (socket) => {
    socketController.onConnection(socket);
  });

  return io;
};

export default Ioconfig;
