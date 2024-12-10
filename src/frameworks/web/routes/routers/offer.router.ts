import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import { OfferController } from "../../../../adapters/controllers/offer.controller";
import Depencies from "../../../dependancies/depencies";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const controller = {
  offer: new OfferController(Depencies),
};

router.get("/:agentId", (req: Request, res: Response, next: NextFunction) =>
  controller.offer.getAllOffers(req, res, next)
);
router.post(
  "/add-offer",
  upload.single("image"),
  (req: Request, res: Response, next: NextFunction) =>
    controller.offer.createOffer(req, res, next)
);
router.get(
  "/fetch-one-offer/:offerId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.offer.getOffer(req, res, next)
);
router.put(
  "/update-offer/:offerId",
  upload.single("image"),
  (req: Request, res: Response, next: NextFunction) =>
    controller.offer.updateOffer(req, res, next)
);
router.patch(
  "/block-offer/:offerId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.offer.blockNUnblockOffer(req, res, next)
);
router.get(
  "/addPackage/:agentId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.offer.addofferPackage(req, res, next)
);


export default router;
