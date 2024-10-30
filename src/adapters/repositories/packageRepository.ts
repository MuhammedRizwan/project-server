import { Icategory } from "../../domain/entities/category/category";
import { Packages } from "../../domain/entities/package/package";
import packageModel from "../database/models/packageModel";

export class MongoPackageRepository {
  async createPackage(package_data: Packages): Promise<Packages | null> {        
    const packageDoc = await packageModel.create( package_data );
    const packageData = packageDoc.toObject() as unknown as Packages;
    return packageData;
  }

  async getPackage(id: string): Promise<Packages | null> {
      const packageData = await packageModel
        .findOne({_id:id})
        .populate<{category_id:Icategory }>("category_id")
    
      if (!packageData) return null;
      return packageData as unknown as Packages;
  }

  async getAllPackages(): Promise<Packages[] | null> {
    const packages: Packages[] | null = await packageModel.find();
    return packages;
  }
  async editPackage(id: string, packageData: Packages): Promise<Packages | null> {
    const updatedPackage: Packages | null = await packageModel.findOneAndUpdate(
      { _id: id },
      { $set: packageData },
      { new: true }
    );
    return updatedPackage;
  }
  async blockNUnblockPackage(packageId: string, isBlock: boolean):Promise<Packages|null> {
    const updatedPackage:Packages|null = await packageModel.findOneAndUpdate(
      { _id: packageId },
      { $set: { isBlock } },
      { new: true }
    );
    return updatedPackage;
  }
  async getAgentPackages(agentId: string): Promise<Packages[] | null> {
    const packages: Packages[] | null = await packageModel.find({travel_agent_id: agentId });
    return packages;
  }
  async getsimilarPackages(offer_price: number): Promise<Packages[] | null> {
    const minPrice = offer_price - 10000;
    const maxPrice = offer_price + 10000;
  
    const packages: Packages[] | null = await packageModel.find({
      offer_price: { $gte: minPrice, $lte: maxPrice }
    });
  
    return packages;
  }

}


