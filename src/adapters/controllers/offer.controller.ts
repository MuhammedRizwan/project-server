import { NextFunction, Request, Response } from "express";
import { OfferUseCase } from "../../application/usecases/offer";
import { isString } from "./admin.controller";
import { CustomError } from "../../domain/errors/customError";

interface Dependencies {
  useCase: {
    OfferUseCase: OfferUseCase;
  };
}

export class OfferController {
  private OfferUseCase: OfferUseCase;
  constructor(dependencies: Dependencies) {
    this.OfferUseCase = dependencies.useCase.OfferUseCase;
  }
  async getAllOffers(req: Request, res: Response, next: NextFunction) {
    try {
      const { agentId } = req.params;
      const search = isString(req.query.search) ? req.query.search : "";
      const page = isString(req.query.page) ? parseInt(req.query.page, 10) : 1;
      const limit = isString(req.query.limit)
        ? parseInt(req.query.limit, 10)
        : 3;
      const filter = isString(req.query.filter) ? req.query.filter : "";
      const { offers, totalItems, totalPages, currentPage } =
        await this.OfferUseCase.getAllOffers(
          agentId,
          search,
          page,
          limit,
          filter
        );
      res.status(200).json({
        success: true,
        message: "Offers fetched successfully",
        filterData: offers,
        totalPages,
        totalItems,
        currentPage,
      });
    } catch (error) {
      next(error);
    }
  }
  async createOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const offer = await this.OfferUseCase.createOffer(req.body, req.file);
      res
        .status(201)
        .json({ success: true, message: "Offer created successfully", offer });
    } catch (error) {
      next(error);
    }
  }
  async getOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const { offerId } = req.params;
      const offer = await this.OfferUseCase.getOffer(offerId);
      return res
        .status(200)
        .json({ success: true, message: "Offer fetched successfully", offer });
    } catch (error) {
      next(error);
    }
  }
  async updateOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const { offerId } = req.params;
      const offer = await this.OfferUseCase.updateOffer(
        offerId,
        req.body,
        req.file
      );
      return res
        .status(200)
        .json({ success: true, message: "Offer updated successfully", offer });
    } catch (error) {
      next(error);
    }
  }
  async blockNUnblockOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const { offerId } = req.params;
      const { is_active } = req.body;
      const offer = await this.OfferUseCase.blockNUnblockOffer(
        offerId,
        is_active
      );
      return res
        .status(200)
        .json({ success: true, message: "Offer status updated", offer });
    } catch (error) {
      next(error);
    }
  }
  async addofferPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const { agentId } = req.params;
      const packages = await this.OfferUseCase.addofferPackage(agentId);
      return res
        .status(200)
        .json({
          success: true,
          message: "Offer updated successfully",
          packages,
        });
    } catch (error) {
      next(error);
    }
  }
  async execute(){
    try {
      await this.OfferUseCase.executeOffers()
    } catch (error) {
      throw new CustomError("internal seerver error",500)
    }
  }
}