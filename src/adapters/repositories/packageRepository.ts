import { Package } from "../../domain/entities/package/package";
import packageModel from "../database/models/packageModel";

export class MongoPackageRepository {
  async createPackage(package_data: Package): Promise<Package | null> {        
    const packageDoc = await packageModel.create( package_data );
    const packageData = packageDoc.toObject() as unknown as Package;
    return packageData;
  }

  async getPackage(id: string): Promise<Package | null> {
  const packageData: Package | null = await packageModel.findById(id);
    return packageData;
  }

  async getAllPackages(): Promise<Package[] | null> {
    const packages: Package[] | null = await packageModel.find();
    return packages;
  }
  async editPackage(id: string, packageData: Package): Promise<Package | null> {
    const updatedPackage: Package | null = await packageModel.findOneAndUpdate(
      { _id: id },
      { $set: packageData },
      { new: true }
    );
    return updatedPackage;
  }
  async blockNUnblockPackage(packageId: string, isBlock: boolean):Promise<Package|null> {
    const updatedPackage:Package|null = await packageModel.findOneAndUpdate(
      { _id: packageId },
      { $set: { isBlock } },
      { new: true }
    );
    return updatedPackage;
  }
  async getAgentPackages(agentId: string): Promise<Package[] | null> {
    const packages: Package[] | null = await packageModel.find({travel_agent_id: agentId });
    return packages;
  }
  async getsimilarPackages(offer_price: number): Promise<Package[] | null> {
    const minPrice = offer_price - 10000;
    const maxPrice = offer_price + 10000;
  
    const packages: Package[] | null = await packageModel.find({
      offer_price: { $gte: minPrice, $lte: maxPrice }
    });
  
    return packages;
  }

}


