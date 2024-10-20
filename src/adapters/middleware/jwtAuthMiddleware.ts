import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../frameworks/services/jwtService";
import { CustomError } from "../../domain/errors/customError";

const jwtService=new JwtService()
const jwtAuth = (req: Request, res: Response, next: NextFunction) => {  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1]; 
  try {
    const decoded = jwtService.verifyAccessToken(token);
    console.log(decoded)
    if(!decoded) throw new CustomError("Invalid token", 401)
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
export default jwtAuth;
