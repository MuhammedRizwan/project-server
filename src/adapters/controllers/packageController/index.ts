import { NextFunction, Request, Response } from "express";
import { packageUseCase } from "../../../application/usecases/package";
import { Packages } from "../../../domain/entities/package/package";
import { isString } from "../adminController";

interface Dependencies {
  useCase: {
    packageUseCase: packageUseCase;
  };
}
export interface filterData{
  category_id:string,
  price_range:string,
  days:string
}
export class PackageController {
  private packageUseCase: packageUseCase;
  constructor(dependencies: Dependencies) {
    this.packageUseCase = dependencies.useCase.packageUseCase;
  }
  async createPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const { original_price, category, agentId } = req.body;

      const package_data: Packages = {
        ...req.body,
        travel_agent_id:agentId,
        category_id: category[0]._id,
        offer_price: original_price,
        images: [],
      };
console.log(package_data)
      const result = await this.packageUseCase.createPackage(
        package_data,
        req.files
      );
      return res.status(201).json({
        success: true,
        message: "package created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllPackages(req: Request, res: Response, next: NextFunction) {
    try {
      console.log()
      const search = isString(req.query.search) ? req.query.search : "";
      const page = isString(req.query.page) ? parseInt(req.query.page, 10) : 1;
      const limit = isString(req.query.limit)
        ? parseInt(req.query.limit, 10)
        : 12;
      const categoryId= isString(req.query.categoryId) ? req.query.categoryId : "";
      const days=isString(req.query.days) ? req.query.days : "";
      const startRange=isString(req.query.startRange) ? req.query.startRange : "",
      endRange=isString(req.query.endRange) ? req.query.endRange : ""
      const { packages, totalItems, totalPages, currentPage } =
        await this.packageUseCase.getAllPackages(search, page, limit,categoryId,days,startRange,endRange);
      return res.status(200).json({
        success: true,
        message: "packages fetched successfully",
        packages,
        totalItems,
        totalPages,
        currentPage,
      });
    } catch (error) {
      next(error);
    }
  }
  async editPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const { packageId } = req.params;
      const result = await this.packageUseCase.editPackage(
        packageId,
        req.body,
        req.files
      );
      return res.status(200).json({
        success: true,
        message: "package updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  async blockNUnblockPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const { is_block } = req.body;
      const { packageId } = req.params;
      const Package = await this.packageUseCase.blocknUnblockPackage(
        packageId,
        is_block
      );
      return res.status(200).json({
        success: true,
        message: "package updated successfully",
        Package,
      });
    } catch (error) {
      next(error);
    }
  }
  async getPackageById(req: Request, res: Response, next: NextFunction) {
    try {
      const { packageId } = req.params;
      const packageData = await this.packageUseCase.getPackage(packageId);
      return res.status(200).json({
        success: true,
        message: "package fetched successfully",
        packageData,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAgentPackages(req: Request, res: Response, next: NextFunction) {
    try {
      const { agentId } = req.params;
      const search = isString(req.query.search) ? req.query.search : "";
      const page = isString(req.query.page) ? parseInt(req.query.page, 10) : 1;
      const limit = isString(req.query.limit)
        ? parseInt(req.query.limit, 10)
        : 3;
      const { packages, totalItems, totalPages, currentPage } =
        await this.packageUseCase.getAgentPackages(
          agentId,
          search,
          page,
          limit
        );
      return res.status(200).json({
        success: true,
        message: "packages fetched successfully",
        packages,
        totalItems,
        totalPages,
        currentPage,
      });
    } catch (error) {
      next(error);
    }
  }
  async getSimilarPackages(req: Request, res: Response, next: NextFunction) {
    try {
      const { packageId } = req.params;
      const packageList = await this.packageUseCase.getSimilarPackages(
        packageId
      );
      return res.status(200).json({
        success: true,
        message: "packages fetched successfully",
        packageList,
      });
    } catch (error) {
      next(error);
    }
  }
}
