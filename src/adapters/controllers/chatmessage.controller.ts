import { NextFunction, Request, Response } from "express";
import { ChatmessageUseCase } from "../../application/usecases/chatmessage";
import { isString } from "./admin.controller";

interface Dependencies {
  UseCase: {
    ChatmessageUseCase: ChatmessageUseCase;
  };
}

export class ChatmessageController {
  private chatmessageUseCase: ChatmessageUseCase;
  constructor(dependencies: Dependencies) {
    this.chatmessageUseCase = dependencies.UseCase.ChatmessageUseCase;
  }
  async getContacts(req: Request, res: Response, next: NextFunction) {
    try {
      const search = isString(req.query.search) ? req.query.search : "";
      const {userId} = req.params
      const users = await this.chatmessageUseCase.getContacts(search,userId);
      return res
        .status(200)
        .json({ success: true, message: "Contacts Fetched", users });
    } catch (error) {
      next(error);
    }
  }
  async getChats(req: Request, res: Response, next: NextFunction) {
    try {
      const search = isString(req.query.search) ? req.query.search : "";
      const {userId} = req.params
      const users = await this.chatmessageUseCase.getChats(search,userId);
      return res
        .status(200)
        .json({ success: true, message: "Contacts Fetched", users });
    } catch (error) {
      next(error);
    }
  }
  async getRoom(req: Request, res: Response, next: NextFunction) {
    try {
        const {recieverId, senderId} = req.params
        const room = await this.chatmessageUseCase.getRoom(recieverId, senderId);
        return res.status(200).json({success:true,message:"Room Fetched",room})
    } catch (error) {
      next(error);
    }
  }
  async getRoomMessage(req:Request,res:Response,next:NextFunction){
    try {
        const {roomId,userId}=req.params
        const room = await this.chatmessageUseCase.getRoomMessage(roomId,userId);
        return res.status(200).json({success:true,message:"Reciever Fetched",room})
    } catch (error) {
        throw error
    }
  }
}
