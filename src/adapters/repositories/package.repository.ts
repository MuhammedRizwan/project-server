import { FilterQuery } from "mongoose";
import { Icategory } from "../../domain/entities/category/category";
import { Packages } from "../../domain/entities/package/package";
import packageModel from "../database/models/package.model";

export class PackageRepository {
  async createPackage(package_data: Packages): Promise<Packages | null> {
    const packageDoc = await packageModel.create(package_data);
    const packageData = packageDoc.toObject() as unknown as Packages;
    return packageData;
  }

  async getPackage(id: string): Promise<Packages | null> {
    const packageData = await packageModel.findOne({ _id: id });
    if (!packageData) return null;
    return packageData as unknown as Packages;
  }

  async getAllPackages(
    query: FilterQuery<Packages>,
    page: number,
    limit: number
  ) {
    const completedQuery = { ...query, is_block: false };
    const packages = await packageModel
      .find(completedQuery)
      .lean()
      .skip((page - 1) * limit)
      .limit(limit);
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
    const updatedPackage: Packages | null = await packageModel.findOneAndUpdate(
      { _id: packageId },
      { $set: { is_block: isBlock } },
      { new: true }
    );

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
      .populate<{ category_id: Icategory }>("category_id")
      .sort({ createdAt: -1 });
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
  async addofferPackage(agentId: string): Promise<Packages[] | null> {
    try {
      const packages: Packages[] | null = await packageModel.find({
        travel_agent_id: agentId,
      });
      return packages;
    } catch (error) {
      throw error;
    }
  }
  async updateOfferPrice(packageId: string, offerPrice: number): Promise<void> {
    try {
      const updateOffer = await packageModel.updateOne(
        { _id: packageId },
        { $set: { offer_price: offerPrice } }
      );
    } catch (error) {
      throw error;
    }
  }
  async getAllPackageCount(): Promise<{
    packagecount: number;
    blockedpackage: number;
    unblockedpackage: number;
  }> {
    try {
      const packagecount = await packageModel.countDocuments();
      const blockedpackage = await packageModel.countDocuments({
        is_block: true,
      });
      const unblockedpackage = await packageModel.countDocuments({
        is_block: false,
      });
      return { packagecount, blockedpackage, unblockedpackage };
    } catch (error) {
      throw error;
    }
  }
  async getpackageCount(agentId: string): Promise<{
    packagecount: number;
    unblockedpackage: number;
  }> {
    try {
      const packagecount = await packageModel.countDocuments({
        travel_agent_id: agentId,
      });
      const unblockedpackage = await packageModel.countDocuments({
        travel_agent_id: agentId,
        is_block: false,
      });
      return { packagecount, unblockedpackage };
    } catch (error) {
      throw error;
    }
  }
}
