import { FilterQuery } from "mongoose";
import { Icategory } from "../../domain/entities/category/category";
import { Packages } from "../../domain/entities/package/package";
import packageModel from "../database/models/packageModel";

export class PackageRepository {
  async createPackage(package_data: Packages): Promise<Packages | null> {
    const packageDoc = await packageModel.create(package_data);
    const packageData = packageDoc.toObject() as unknown as Packages;
    return packageData;
  }

  async getPackage(id: string): Promise<Packages | null> {
    const packageData = await packageModel
      .findOne({ _id: id })
    if (!packageData) return null;
    return packageData as unknown as Packages;
  }

  async getAllPackages(query: FilterQuery<Packages>, page: number, limit: number){
    console.log(query,"query")
    const completedQuery = { ...query, is_block: false };
    const packages= await packageModel.find(completedQuery).lean().skip((page - 1) * limit).limit(limit); 
    return packages;
  }
  async editPackage(
    id: string,
    packageData: Packages
  ): Promise<Packages | null> {
    const updatedPackage: Packages | null = await packageModel.findOneAndUpdate(
      { _id: id },
      { $set: packageData },
      { new: true }
    );
    return updatedPackage;
  }
  async blockNUnblockPackage(
    packageId: string,
    isBlock: boolean
  ): Promise<Packages | null> {
    console.log(isBlock);
    const updatedPackage: Packages | null = await packageModel.findOneAndUpdate(
      { _id: packageId },
      { $set: { is_block: isBlock } },
      { new: true }
    );
    console.log(updatedPackage);
    return updatedPackage;
  }
  async getAgentPackages(
    agentId: string,
    query: FilterQuery<Packages>,
    page: number,
    limit: number
  ) {
    const completedQuery = { travel_agent_id: agentId, ...query };
    const Packages = await packageModel
      .find(completedQuery)
      .lean() 
      .skip((page - 1) * limit)
      .limit(limit)
      .populate<{ category_id: Icategory }>("category_id");
    return Packages;
  }
  async getsimilarPackages(offer_price: number): Promise<Packages[] | null> {
    const minPrice = offer_price - 5000;
    const maxPrice = offer_price + 5000;

    const packages = await packageModel
      .find({
        offer_price: { $gte: minPrice, $lte: maxPrice },
      })
      .limit(4);

    return packages as unknown as Packages[];
  }
  async packageCount(query: FilterQuery<Packages>): Promise<number> {
    const totalItems = await packageModel.countDocuments(query);
    return totalItems;
  }
}
