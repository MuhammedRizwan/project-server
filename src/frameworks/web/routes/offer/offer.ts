import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import { OfferController } from "../../../../adapters/controllers/offerController";
import OfferDepencies from "../../../dependancies/offerdependencies";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const controller = {
  offer: new OfferController(OfferDepencies),
};