import { Packages } from "../../../domain/entities/package/package";
import { CustomError } from "../../../domain/errors/customError";

interface MongoPackageRepository {
  createPackage( package_data: Packages): Promise<Packages | null>;
  getPackage(id: string): Promise<Packages | null>;
  getAllPackages(): Promise<Packages[] | null>;
  editPackage(id: string, packageData: Packages): Promise<Packages | null>;
  blockNUnblockPackage(packageId: string, isBlock: boolean): Promise<Packages|null>;
  getAgentPackages(agentId: string): Promise<Packages[] | null>;
  getsimilarPackages(offer_price: number): Promise<Packages[] | null>;
}
interface CloudinaryService {
  uploadImage(file: Express.Multer.File | undefined): Promise<string>;
}
interface Dependencies {
  Repositories: {
    MongoPackageRepository: MongoPackageRepository;
  };
  services: {
    CloudinaryService: CloudinaryService;
  };
}
export class packageUseCase {
  private packageRepository: MongoPackageRepository;
  private cloudinaryService: CloudinaryService;
  constructor(dependencies: Dependencies) {
    this.packageRepository = dependencies.Repositories.MongoPackageRepository;
    this.cloudinaryService = dependencies.services.CloudinaryService;
  }
  async createPackage(
    package_data: Packages,
    files: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[] | undefined
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
    if(!packageData) {
        throw new CustomError("Package not found", 404);
    }
    return packageData;
  }
  async getAllPackages() {
    const packages = await this.packageRepository.getAllPackages();
    if(!packages) {
        throw new CustomError("Package not found", 404);
    }
    return packages;
  }
  async editPackage(id: string, packageData: Packages, files: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[] | undefined) {
    const editedPackage = await this.packageRepository.editPackage(id, packageData);

    if(!editedPackage) {
        throw new CustomError("Package not found", 404);
    }
    return editedPackage;
  }
  async blocknUnblockPackage(packageId: string, isBlock: boolean) {
    const updatedPackage = await this.packageRepository.blockNUnblockPackage(packageId, isBlock);
    if(!updatedPackage) {
        throw new CustomError("Package not found", 404);
    }
    return updatedPackage;
  }
  async getAgentPackages(agentId: string) {
    const packages = await this.packageRepository.getAgentPackages(agentId);
    if(!packages) {
        throw new CustomError("Package not found", 404);
    }
    return packages;
  }
  async getSimilarPackages(packageId: string) {
    try {
      const packages = await this.packageRepository.getPackage(packageId);
      if(!packages) {
          throw new CustomError("Package not found", 404);
      }
      const similarPackages = await this.packageRepository.getsimilarPackages(packages.offer_price);
      if(!similarPackages) {
          throw new CustomError("Similar packages not found", 404);
      }
      return similarPackages
    } catch (error) {
      throw error
    }
  }
}
