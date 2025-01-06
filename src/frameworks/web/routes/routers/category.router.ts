import { NextFunction, Request, Response, Router } from "express";
import { categoryController } from "../../../../adapters/controllers/category.controller";
import multer from "multer";
import Depencies from "../../../dependancies/depencies";
import { validateSchema } from "../../../../adapters/middleware/validator.middleware";
import { category_schema } from "../../../../domain/validator/admin-validator";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const controller = {
  category: new categoryController(Depencies),
};
router.get("/", (req: Request, res: Response, next: NextFunction) =>
  controller.category.getAllCategories(req, res, next)
);
router.get("/unblocked", (req: Request, res: Response, next: NextFunction) =>
  controller.category.getUnblockedCategories(req, res, next)
);
router.post(
  "/add",
  upload.single("image"),
  validateSchema(category_schema),
  (req: Request, res: Response, next: NextFunction) =>
    controller.category.createCategory(req, res, next)
);
router.patch("/block", (req: Request, res: Response, next: NextFunction) =>
  controller.category.blockNUnblockCategory(req, res, next)
);
router.post(
  "/update/:categoryId",
  upload.single("image"),
  validateSchema(category_schema),
  (req: Request, res: Response, next: NextFunction) =>
    controller.category.updateCategory(req, res, next)
);

export default router;
