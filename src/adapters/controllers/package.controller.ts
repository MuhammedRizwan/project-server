import { NextFunction, Request, Response } from "express";
import { packageUseCase } from "../../application/usecases/package";
import { Packages } from "../../domain/entities/package/package";
import { isString } from "./admin.controller";
import HttpStatusCode from "../../domain/enum/httpstatus";

interface Dependencies {
  useCase: {
    packageUseCase: packageUseCase;
  };
}
export interface filterData {
  category_id: string;
  price_range: string;
  days: string;
}
export class PackageController {
  private _packageUseCase: packageUseCase;
  constructor(dependencies: Dependencies) {
    this._packageUseCase = dependencies.useCase.packageUseCase;
  }
  async createPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const { original_price, agentId } = req.body;

      const package_data: Packages = {
        ...req.body,
        travel_agent_id: agentId,
        offer_price: original_price,
        images: [],
      };
      const result = await this._packageUseCase.createPackage(
        package_data,
        req.files
      );
      return res.status(HttpStatusCode.CREATED).json({
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
      const search = isString(req.query.search) ? req.query.search : "";
      const page = isString(req.query.page) ? parseInt(req.query.page, 10) : 1;
      const limit = isString(req.query.limit)
        ? parseInt(req.query.limit, 10)
        : 12;
      const categoryId = isString(req.query.categoryId)
        ? req.query.categoryId
        : "";
      const days = isString(req.query.days) ? req.query.days : "";
      const startRange = isString(req.query.startRange)
          ? req.query.startRange
          : "",
        endRange = isString(req.query.endRange) ? req.query.endRange : "";
      const { packages, totalItems, totalPages, currentPage } =
        await this._packageUseCase.getAllPackages(
          search,
          page,
          limit,
          categoryId,
          days,
          startRange,
          endRange
        );
      return res.status(HttpStatusCode.OK).json({
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
      const result = await this._packageUseCase.editPackage(
        packageId,
        req.body,
        req.files
      );
      return res.status(HttpStatusCode.OK).json({
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
      const Package = await this._packageUseCase.blocknUnblockPackage(
        packageId,
        is_block
      );
      return res.status(HttpStatusCode.OK).json({
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
      const packageData = await this._packageUseCase.getPackage(packageId);
      return res.status(HttpStatusCode.OK).json({
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
        await this._packageUseCase.getAgentPackages(
          agentId,
          search,
          page,
          limit
        );
      return res.status(HttpStatusCode.OK).json({
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
      const packageList = await this._packageUseCase.getSimilarPackages(
        packageId
      );
      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "packages fetched successfully",
        packageList,
      });
    } catch (error) {
      next(error);
    }
  }
  async updatePackageImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { oldPublicId } = req.body;
      const image = req.file;
      const imageUrl = await this._packageUseCase.updatePackageImage(
        image,
        oldPublicId
      );
      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "image updated successfully",
        imageUrl,
      });
    } catch (error) {
      next(error);
    }
  }
  async deletePackageImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { publicId } = req.body;
      await this._packageUseCase.deletePackageImage(publicId);
      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "image deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
