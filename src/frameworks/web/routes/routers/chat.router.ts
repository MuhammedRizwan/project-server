import { NextFunction, Request, Response, Router } from "express";
import { ChatmessageController } from "../../../../adapters/controllers/chatmessage.controller";
import Depencies from "../../../dependancies/depencies";


const router = Router();


const controller = {
  chatMessage: new ChatmessageController(Depencies),
};
router.get("/contacts/:userId", (req: Request, res: Response, next: NextFunction) =>
  controller.chatMessage.getContacts(req, res, next)
);
router.get("/chats/:userId", (req: Request, res: Response, next: NextFunction) =>
  controller.chatMessage.getChats(req, res, next)
);
router.get("/room/:recieverId/:senderId", (req: Request, res: Response, next: NextFunction) =>
  controller.chatMessage.getRoom(req, res, next))
router.get("/room-message/:roomId/:userId", (req: Request, res: Response, next: NextFunction) =>
  controller.chatMessage.getRoomMessage(req, res, next))
export default router;
