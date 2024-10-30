import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../frameworks/services/jwtService";
import { CustomError } from "../../domain/errors/customError";
import { JwtPayload } from "jsonwebtoken";

const jwtService = new JwtService();

export interface CustomRequest extends Request {
  user?: string | object; // Adjust based on your token structure
}
const jwtAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwtService.verifyAccessToken(token);
    if (!decoded) throw new CustomError("Invalid token", 401);
    console.log("Decoded Token:", decoded);

    // Attach the decoded user data to the request object
    req.user =( decoded as JwtPayload).user; ;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
export default jwtAuth;
