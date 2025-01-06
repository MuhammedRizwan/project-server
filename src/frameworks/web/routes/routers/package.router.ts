import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import { PackageController } from "../../../../adapters/controllers/package.controller";
import Depencies from "../../../dependancies/depencies";
import { validateSchema } from "../../../../adapters/middleware/validator.middleware";
import { package_schema } from "../../../../domain/validator/agent-validator";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const controller = {
  package: new PackageController(Depencies),
};

router.get("/", (req: Request, res: Response, next: NextFunction) =>
  controller.package.getAllPackages(req, res, next)
);
router.get(
  "/agent/:agentId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.package.getAgentPackages(req, res, next)
);
router.post(
  "/add",
  upload.array("images[]", 6),
  validateSchema(package_schema),
  (req: Request, res: Response, next: NextFunction) =>
    controller.package.createPackage(req, res, next)
);

router.patch("/block/:packageId", (req: Request, res: Response, next: NextFunction) =>
  controller.package.blockNUnblockPackage(req, res, next)
);
router.get("/:packageId", (req: Request, res: Response, next: NextFunction) =>
  controller.package.getPackageById(req, res, next)
);
router.put(
  "/edit/:packageId",
  upload.array("images[]", 6),
  validateSchema(package_schema),
  (req: Request, res: Response, next: NextFunction) =>
    controller.package.editPackage(req, res, next)
);
router.get(
  "/similar/:packageId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.package.getSimilarPackages(req, res, next)
);
router.post("/update-image",upload.single("file"),(req: Request, res: Response, next: NextFunction) => 
  controller.package.updatePackageImage(req, res, next))
router.post('/delete-image',(req: Request, res: Response, next: NextFunction) =>
controller.package.deletePackageImage(req, res, next))
export default router;
