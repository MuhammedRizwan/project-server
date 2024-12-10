// Ioconfig.ts
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import ChatController from "../../adapters/controllers/chat.controller";
import Depencies from "../dependancies/depencies";

const Ioconfig = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const socketController = new ChatController(io, Depencies);

  io.on("connection", (socket) => {
    socketController.onConnection(socket);
  });

  return io;
};

export default Ioconfig;
