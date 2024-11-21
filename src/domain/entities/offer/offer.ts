import { Packages } from "../package/package";


export default interface Offer {
    _id?:string;
    agent_id: string;
    offer_name: string;
    description: string;
    package_id: string[]|Packages[];
    image: string;
    percentage: number;
    max_offer: number;
    is_active: boolean;
    valid_from: Date;
    valid_upto: Date;
}