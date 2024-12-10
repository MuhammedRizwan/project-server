
import mongoose, { FilterQuery } from "mongoose";
import { Icategory } from "../category/category";

export interface Itinerary {
    day: number;
    activity: string;
  }
  
  export interface Packages  {
    _id?:string
    travel_agent_id?:mongoose.Types.ObjectId
    package_name: string;
    category_id?: string|Icategory;  
    destinations: string[];
    original_price: number;
    offer_price: number;
    max_person: number;
    no_of_days: number;
    no_of_nights: number;
    itineraries: Itinerary[];  
    is_block?: boolean;
    images?: string[];
    includedItems:string[],
    excludedItems:string[],
    description?: string;
    departure_place:string
  }

  interface PackageQuery {
    $or?:
      | { package_name: { $regex: string; $options: string } }[]
      | { destinations: { $regex: string; $options: string } }[];
    category_id?: string;
    no_of_days?: string;
    price?: { $gte?: number; $lte?: number };
  }


   export interface PackageRepository {
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
    addofferPackage(agentId: string): Promise<Packages[] | null>;
    updateOfferPrice(
      package_id: string | undefined,
      offerPrice: number
    ): Promise<void>;
  }
  