import { NextFunction, Request, Response } from "express";
import { packageUseCase } from "../../../application/usecases/package";
import { Package } from "../../../domain/entities/package/package";

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
      const {travel_agent_id, package_name, destinations, original_price, max_person, no_of_days, no_of_nights, itineraries,category ,includedItems,excludedItems} = req.body;
      
      const package_data: Package = {
        travel_agent_id,
        package_name,
        destinations,
        category_id: category[0]._id,
        original_price,
        offer_price: original_price, 
        max_person,
        no_of_days,
        no_of_nights,                                    
        itineraries,
        images: [],
        includedItems,
        excludedItems
      };
     
      const result = await this.packageUseCase.createPackage(package_data, req.files);
      return res
        .status(201)
        .json({ message: "package created successfully", data: result });
    } catch (error) {
      next(error);
    }
  }
  async getAllPackages(req: Request, res: Response, next: NextFunction) {
    try { 
      console.log("+++++++++++++++++++++++++++")
      const packageList = await this.packageUseCase.getAllPackages();
      return res
        .status(200)
        .json({ message: "packages fetched successfully", packageList });
    } catch (error) {
      next(error);
    }
  }
  async editPackage(req: Request, res: Response, next: NextFunction) {
    try {
        const { package_name, destinations, original_price,offer_price,max_person,no_of_days,no_of_nights,itineraries,includedItems,excludedItems } = req.body;
        const { packageId } = req.params;
        const result = await this.packageUseCase.editPackage(
            packageId,
            {
              package_name, destinations, original_price, offer_price, max_person, no_of_days, no_of_nights, itineraries,includedItems,excludedItems
            },
            req.files,
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
  async getPackageById(req: Request, res: Response, next: NextFunction) {
    try {
        const { packageId } = req.params;
        const packageData = await this.packageUseCase.getPackage(packageId);
        return res
          .status(200)
          .json({ message: "package fetched successfully", packageData });
    } catch (error) {
        next(error);
    }
  }
  async getAgentPackages(req: Request, res: Response, next: NextFunction) {
    try {      
        const { agentId } = req.params;
        const packageList = await this.packageUseCase.getAgentPackages(agentId);
        return res
          .status(200)
          .json({ message: "packages fetched successfully", packageList });
    } catch (error) {
        next(error);
    }
  }
  async getSimilarPackages(req: Request, res: Response, next: NextFunction) {
    try {
        const { packageId } = req.params;
        const packageList = await this.packageUseCase.getSimilarPackages(packageId);
        return res
          .status(200)
          .json({status: "success", message: "packages fetched successfully", packageList });
    } catch (error) {
        next(error);
    }
  }
}
