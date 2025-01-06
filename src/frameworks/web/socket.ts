import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import Depencies from "../dependancies/depencies";
import SocketController from "../../adapters/controllers/socket.controller";
import configKeys from "../../config";

const Ioconfig = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin:[configKeys.FRONT_URL, "http://localhost:3000"] ,
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
