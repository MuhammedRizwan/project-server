import { NextFunction, Request, Response } from "express";
import { packageUseCase } from "../../../application/usecases/package";

interface Dependencies {
  useCase: {
    packageUseCase: packageUseCase;
  };
}
export class PackageController {
  private packageUseCase: packageUseCase;
  constructor(dependencies: Dependencies) {
    this.packageUseCase = dependencies.useCase.packageUseCase;
  }
  async createPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.packageUseCase.createPackage(req.body);
      return res
        .status(201)
        .json({ message: "package created successfully", data: result });
    } catch (error) {
      next(error);
    }
  }
  async getAllPackages(req: Request, res: Response, next: NextFunction) {
    try {        
      const packageList = await this.packageUseCase.getAllPackages();
      return res
        .status(200)
        .json({ message: "packages fetched successfully", packageList });
    } catch (error) {
      next(error);
    }
  }
  async updatePackage(req: Request, res: Response, next: NextFunction) {
    try {
        const { package_name, destinations, original_price,offer_price,max_person,no_of_day,no_of_night,itineraries } = req.body;
        const { id } = req.params;
        const result = await this.packageUseCase.editPackage(
            id,
            {
                package_name, destinations, original_price, offer_price, max_person, no_of_day, no_of_night, itineraries
                
            },
        );
        return res
          .status(200)
          .json({ message: "package updated successfully", data: result });
    } catch (error) {
        next(error);
    }
  }
  async blockNUnblockPackage(req: Request, res: Response, next: NextFunction) {
    try {
        const { id, is_block } = req.body;
        const result = await this.packageUseCase.blocknUnblockPackage(
          id,
          is_block,
        );
        return res
          .status(200)
          .json({ message: "package updated successfully", data: result });
    } catch (error) {
        next(error);
    }
  }
}
