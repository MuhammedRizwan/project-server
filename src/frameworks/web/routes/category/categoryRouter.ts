import { NextFunction, Request, Response, Router } from "express";
import { categoryController } from "../../../../adapters/controllers/categoryController";
import CategoryDepencies from "../../../dependancies/categorydepencies";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const controller = {
  category: new categoryController(CategoryDepencies),
};
router.get("/", (req: Request, res: Response, next: NextFunction) =>
  controller.category.getAllCategories(req, res, next)
);
router.get('/unblocked', (req: Request, res: Response, next: NextFunction) =>
  controller.category.getUnblockedCategories(req, res, next)
);
router.post("/add",upload.single("image"),(req: Request, res: Response, next: NextFunction) =>
  controller.category.createCategory(req, res, next)
);
router.patch("/block", (req: Request, res: Response, next: NextFunction) =>
  controller.category.blockNUnblockCategory(req, res, next)
);
router.post("/update/:categoryId",upload.single("image"),(req: Request, res: Response, next: NextFunction) =>
  controller.category.updateCategory(req, res, next)
);

export default router;
