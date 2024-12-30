import { PackageRepository, Packages } from "../../../domain/entities/package/package";
import { CustomError } from "../../../domain/errors/customError";
import { CloudinaryService } from "../../../domain/entities/services/service";
import { Dependencies } from "../../../domain/entities/depencies/depencies";


export class packageUseCase {
  private _packageRepository: PackageRepository;
  private _cloudinaryService: CloudinaryService;
  constructor(dependencies: Dependencies) {
    this._packageRepository = dependencies.Repositories.PackageRepository;
    this._cloudinaryService = dependencies.Services.CloudinaryService;
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
          const imageUrl = await this._cloudinaryService.uploadImage(image);
          return imageUrl;
        })
      );
    }
    const newPackage = await this._packageRepository.createPackage(package_data);
    if (!newPackage) {
      throw new CustomError("Package creation failed", 500);
    }
    return newPackage;
  }
  async getPackage(id: string) {
    const packageData = await this._packageRepository.getPackage(id);
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
    const query:any = search
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

    const packages = await this._packageRepository.getAllPackages(
      query,
      page,
      limit
    );
    if (!packages) {
      throw new CustomError("Package not found", 404);
    }
    const totalItems = await this._packageRepository.packageCount(query);
    console.log(totalItems)
    if (totalItems === 0) {
      throw new CustomError("Packages not found", 404);
    }
    console.log(totalItems,limit,"total Items")
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
    packageData.offer_price=packageData.original_price
    const editedPackage = await this._packageRepository.editPackage(
      id,
      packageData
    );

    if (!editedPackage) {
      throw new CustomError("Package not found", 404);
    }
    return editedPackage;
  }
  async blocknUnblockPackage(packageId: string, isBlock: boolean) {
    const updatedPackage = await this._packageRepository.blockNUnblockPackage(
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
    const packages = await this._packageRepository.getAgentPackages(
      agentId,
      query,
      page,
      limit
    );
    if (!packages) {
      throw new CustomError("Package not found", 404);
    }
    const totalItems = await this._packageRepository.packageCount(query);
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
      const packages = await this._packageRepository.getPackage(packageId);
      if (!packages) {
        throw new CustomError("Package not found", 404);
      }
      const similarPackages = await this._packageRepository.getsimilarPackages(
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
  async updatePackageImage(image: Express.Multer.File|undefined,publicId:string){
    try {
      const imageUrl = await this._cloudinaryService.updateImage(image,publicId);
      if (!imageUrl) {
        throw new CustomError("Package not found", 404);
      }
      return imageUrl;
    } catch (error) {
      throw error
    }
  }
  async deletePackageImage(publicId:string) {
    try {
      await this._cloudinaryService.deleteImage(publicId);
    } catch (error) {
      throw error;
    }
  }
}
