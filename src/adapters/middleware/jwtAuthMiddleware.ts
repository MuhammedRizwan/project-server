import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../frameworks/services/jwtService";

const jwtService=new JwtService()
const jwtAuth = (req: Request, res: Response, next: NextFunction) => {  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1]; 
  try {
    const decoded = jwtService.verifyAccessToken(token);
    if(!decoded) throw new Error("Invalid token")
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
export default jwtAuth;
