import { Document, ObjectId } from "mongoose";

export interface Itinerary {
    day: number;
    activity: string;
  }
  
  export interface PackageData {
    _id?: ObjectId;
    package_name: string;
    category_id?: ObjectId;  
    destinations: string[];
    original_price: number;
    offer_price: number;
    max_person: number;
    no_of_day: number;
    no_of_night: number;
    itineraries: Itinerary[];  
    is_block?: boolean;
  }
  
  export interface Package extends Document  {
    travel_agent_id?: ObjectId; 
    package_data: PackageData[];
  }
  