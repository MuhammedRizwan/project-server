import { NextFunction, Request, Response } from "express";
import { OfferUseCase } from "../../../application/usecases/offer";


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
}