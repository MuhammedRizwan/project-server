import { NextFunction, Request, Response } from "express";
import { ChatmessageUseCase } from "../../application/usecases/chatmessage";
import { isString } from "./admin.controller";
import HttpStatusCode from "../../domain/enum/httpstatus";

interface Dependencies {
  useCase: {
    ChatmessageUseCase: ChatmessageUseCase;
  };
}

export class ChatmessageController {
  private _chatmessageUseCase: ChatmessageUseCase;
  constructor(dependencies: Dependencies) {
    this._chatmessageUseCase = dependencies.useCase.ChatmessageUseCase;
  }
  async getContacts(req: Request, res: Response, next: NextFunction) {
    try {
      const search = isString(req.query.search) ? req.query.search : "";
      const {userId} = req.params
      const users = await this._chatmessageUseCase.getContacts(search,userId);
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, message: "Contacts Fetched", users });
    } catch (error) {
      next(error);
    }
  }
  async getChats(req: Request, res: Response, next: NextFunction) {
    try {
      const search = isString(req.query.search) ? req.query.search : "";
      const {userId} = req.params
      const users = await this._chatmessageUseCase.getChats(search,userId);
      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, message: "Contacts Fetched", users });
    } catch (error) {
      next(error);
    }
  }
  async getRoom(req: Request, res: Response, next: NextFunction) {
    try {
        const {recieverId, senderId} = req.params
        const room = await this._chatmessageUseCase.getRoom(recieverId, senderId);
        return res.status(HttpStatusCode.OK).json({success:true,message:"Room Fetched",room})
    } catch (error) {
      next(error);
    }
  }
  async getRoomMessage(req:Request,res:Response,next:NextFunction){
    try {
        const {roomId,userId}=req.params
        const room = await this._chatmessageUseCase.getRoomMessage(roomId,userId);
        return res.status(HttpStatusCode.OK).json({success:true,message:"Reciever Fetched",room})
    } catch (error) {
        throw error
    }
  }
}
