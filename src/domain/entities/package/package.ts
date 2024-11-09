
import mongoose from "mongoose";
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
  