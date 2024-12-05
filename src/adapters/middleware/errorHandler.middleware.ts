import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../domain/errors/customError";

export const errorHandler = (
  err: CustomError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {    
    console.log("iiiiii",err);
    
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }
  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
    details: err.message,
  });
};
