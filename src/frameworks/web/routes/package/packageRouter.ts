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
router.get(
  "/agent/:agentId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.package.getAgentPackages(req, res, next)
);
router.post(
  "/add",
  upload.array("images[]", 10),
  (req: Request, res: Response, next: NextFunction) =>
    controller.package.createPackage(req, res, next)
);

router.patch("/block", (req: Request, res: Response, next: NextFunction) =>
  controller.package.blockNUnblockPackage(req, res, next)
);
router.get("/:packageId", (req: Request, res: Response, next: NextFunction) =>
  controller.package.getPackageById(req, res, next)
);
router.put(
  "/edit/:packageId",
  upload.array("images[]", 10),
  (req: Request, res: Response, next: NextFunction) =>
    controller.package.editPackage(req, res, next)
);
router.get(
  "/similar/:packageId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.package.getSimilarPackages(req, res, next)
);
export default router;
