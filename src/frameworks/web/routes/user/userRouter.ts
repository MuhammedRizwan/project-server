import { Request, Response, Router } from "express";
import UserDependancies from "../../../dependancies/userDepencies";
import { userController } from "../../../../adapters/controllers/userController";
import { validateSchema } from "../../../../adapters/middleware/validatorMiddleware";
import { userSignupSchema } from "../../../../domain/validator/userSignup";
const router = Router();

const controller = {
  user: new userController(UserDependancies),
};
router.post("/signup",validateSchema(userSignupSchema),(req:Request, res:Response) =>
  controller.user.createUser(req, res)
);
router.post('/login',(req:Request,res:Response)=>{
    controller.user.loginUser(req,res)
})
export default router;
