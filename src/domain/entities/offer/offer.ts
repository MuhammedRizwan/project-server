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

export interface OfferRepository {
    getAllOffers(
      agentId: string,
      query: object,
      page: number,
      limit: number,
      filter: object
    ): Promise<Offer[]>;
    createOffer(offer: Offer): Promise<Offer>;
    countDocument(
      agentId: string,
      query: object,
      filter: object
    ): Promise<number>;
    getOffer(offerId: string): Promise<Offer>;
    updateOffer(offerId: string, offer: Offer): Promise<Offer>;
    blockNUnblockOffer(offerId: string, is_active: boolean): Promise<Offer>;
    getAllOffersToday(today: Date): Promise<Offer[]>;
    getAllOffersExpired(today: Date): Promise<Offer[]>;
  }