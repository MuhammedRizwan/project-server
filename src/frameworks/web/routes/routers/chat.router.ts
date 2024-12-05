import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import { ChatmessageController } from "../../../../adapters/controllers/chatmessage.controller";
import ChatmessageDependencies from "../../../dependancies/chatmessagedepencies";

const router = Router();
// const upload = multer({ storage: multer.memoryStorage() });

const controller = {
  chatMessage: new ChatmessageController(ChatmessageDependencies),
};
router.get("/contacts/:userId", (req: Request, res: Response, next: NextFunction) =>
  controller.chatMessage.getContacts(req, res, next)
);
router.get("/room/:recieverId/:senderId", (req: Request, res: Response, next: NextFunction) =>
  controller.chatMessage.getRoom(req, res, next))
router.get("/room-message/:roomId", (req: Request, res: Response, next: NextFunction) =>
  controller.chatMessage.getRoomMessage(req, res, next))
export default router;
