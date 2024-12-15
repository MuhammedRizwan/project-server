// Ioconfig.ts
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import Depencies from "../dependancies/depencies";
import SocketController from "../../adapters/controllers/socket.controller";

const Ioconfig = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const socketController = new SocketController(io, Depencies);

  io.on("connection", (socket) => {
    socketController.onConnection(socket);
  });

  return io;
};

export default Ioconfig;
