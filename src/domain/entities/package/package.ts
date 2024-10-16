import { Document, ObjectId } from "mongoose";

export interface Itinerary {
    day: number;
    activity: string;
  }
  
  export interface Package  {
    _id?:string
    travel_agent_id?: ObjectId; 
    package_name: string;
    category_id?: ObjectId;  
    destinations: string[];
    original_price: number;
    offer_price: number;
    max_person: number;
    no_of_days: number;
    no_of_nights: number;
    itineraries: Itinerary[];  
    is_block?: boolean;
    images?: string[];
  }
  