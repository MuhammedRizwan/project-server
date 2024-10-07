import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import { PackageController } from "../../../../adapters/controllers/packageController";
import PackageDepencies from "../../../dependancies/packagedepencies";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const controller = {
  package: new PackageController(PackageDepencies),
};

router.get("/", (req: Request, res: Response, next: NextFunction) =>
  controller.package.getAllPackages(req, res, next)
);
router.post(
  "/add",
  upload.array("image"),
  (req: Request, res: Response, next: NextFunction) =>
    controller.package.createPackage(req, res, next)
);
router.put(
  "/update/:packageId",
  upload.single("image"),
  (req: Request, res: Response, next: NextFunction) =>
    controller.package.updatePackage(req, res, next)
);
router.patch("/block", (req: Request, res: Response, next: NextFunction) =>
  controller.package.blockNUnblockPackage(req, res, next)
);
export default router;
