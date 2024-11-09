import { FilterQuery } from "mongoose";
import { Packages } from "../../../domain/entities/package/package";
import { CustomError } from "../../../domain/errors/customError";

interface PackageRepository {
  createPackage(package_data: Packages): Promise<Packages | null>;
  getPackage(id: string): Promise<Packages | null>;
  getAllPackages(
    query: FilterQuery<Packages>,
    page: number,
    limit: number
  ): Promise<unknown>;
  editPackage(id: string, packageData: Packages): Promise<Packages | null>;
  blockNUnblockPackage(
    packageId: string,
    isBlock: boolean
  ): Promise<Packages | null>;
  getAgentPackages(
    agentId: string,
    query: FilterQuery<Packages>,
    page: number,
    limit: number
  ): Promise<unknown>;
  getsimilarPackages(offer_price: number): Promise<Packages[] | null>;
  packageCount(query: FilterQuery<Packages>): Promise<number>;
}
interface CloudinaryService {
  uploadImage(file: Express.Multer.File | undefined): Promise<string>;
}
interface Dependencies {
  Repositories: {
    PackageRepository: PackageRepository;
  };
  services: {
    CloudinaryService: CloudinaryService;
  };
}

interface PackageQuery {
  $or?:
    | { package_name: { $regex: string; $options: string } }[]
    | { destinations: { $regex: string; $options: string } }[];
  category_id?: string;
  no_of_days?: string;
  price?: { $gte?: number; $lte?: number };
}
export class packageUseCase {
  private packageRepository: PackageRepository;
  private cloudinaryService: CloudinaryService;
  constructor(dependencies: Dependencies) {
    this.packageRepository = dependencies.Repositories.PackageRepository;
    this.cloudinaryService = dependencies.services.CloudinaryService;
  }
  async createPackage(
    package_data: Packages,
    files:
      | { [fieldname: string]: Express.Multer.File[] }
      | Express.Multer.File[]
      | undefined
  ) {
    if (Array.isArray(files)) {
      package_data.images = await Promise.all(
        files.map(async (image) => {
          const imageUrl = await this.cloudinaryService.uploadImage(image);
          return imageUrl;
        })
      );
    }
    const newPackage = await this.packageRepository.createPackage(package_data);
    if (!newPackage) {
      throw new CustomError("Package creation failed", 500);
    }
    return newPackage;
  }
  async getPackage(id: string) {
    const packageData = await this.packageRepository.getPackage(id);
    if (!packageData) {
      throw new CustomError("Package not found", 404);
    }
    return packageData;
  }
  async getAllPackages(
    search: string,
    page: number,
    limit: number,
    categoryId: string,
    days: string,
    startRange: string,
    endRange: string
  ) {
    const query: any = search
      ? { destinations: { $elemMatch: { $regex: search, $options: "i" } } }
      : {};
    if (categoryId) {
      query.category_id = categoryId;
    }

    if (days) {
      query.no_of_days = parseInt(days, 10);
    }
    if (startRange && endRange) {
      query.offer_price = {
        $gte: parseInt(startRange, 10),
        $lte: parseInt(endRange, 10),
      };
    } else if (startRange) {
      query.offer_price = { $gte: parseInt(startRange, 10) };
    } else if (endRange) {
      query.offer_price = { $lte: parseInt(endRange, 10) };
    }

    const packages = await this.packageRepository.getAllPackages(
      query,
      page,
      limit
    );
    if (!packages) {
      throw new CustomError("Package not found", 404);
    }
    const totalItems = await this.packageRepository.packageCount(query);
    if (totalItems === 0) {
      throw new CustomError("Packages not found", 404);
    }

    return {
      packages,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
  }
  async editPackage(
    id: string,
    packageData: Packages,
    files:
      | { [fieldname: string]: Express.Multer.File[] }
      | Express.Multer.File[]
      | undefined
  ) {
    const editedPackage = await this.packageRepository.editPackage(
      id,
      packageData
    );

    if (!editedPackage) {
      throw new CustomError("Package not found", 404);
    }
    return editedPackage;
  }
  async blocknUnblockPackage(packageId: string, isBlock: boolean) {
    const updatedPackage = await this.packageRepository.blockNUnblockPackage(
      packageId,
      isBlock
    );
    if (!updatedPackage) {
      throw new CustomError("Package not found", 404);
    }
    return updatedPackage;
  }
  async getAgentPackages(
    agentId: string,
    search: string,
    page: number,
    limit: number
  ) {
    const query = search
      ? { package_name: { $regex: search, $options: "i" } }
      : {};
    const packages = await this.packageRepository.getAgentPackages(
      agentId,
      query,
      page,
      limit
    );
    if (!packages) {
      throw new CustomError("Package not found", 404);
    }
    const totalItems = await this.packageRepository.packageCount(query);
    if (totalItems === 0) {
      throw new CustomError("coupons not found", 404);
    }

    return {
      packages,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
  }
  async getSimilarPackages(packageId: string) {
    try {
      const packages = await this.packageRepository.getPackage(packageId);
      if (!packages) {
        throw new CustomError("Package not found", 404);
      }
      const similarPackages = await this.packageRepository.getsimilarPackages(
        packages.offer_price
      );
      if (!similarPackages) {
        throw new CustomError("Similar packages not found", 404);
      }
      return similarPackages;
    } catch (error) {
      throw error;
    }
  }
}
