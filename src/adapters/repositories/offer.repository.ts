import Offer from "../../domain/entities/offer/offer";
import HttpStatusCode from "../../domain/enum/httpstatus";
import { CustomError } from "../../domain/errors/customError";
import offerModel from "../database/models/offer.model";

export class OfferRepository {
  async getAllOffers(
    agentId: string,
    query: object,
    page: number,
    limit: number,
    filterData: object
  ): Promise<Offer[]> {
    try {
      const completedQuery = { agent_id: agentId, ...query, ...filterData };
      const offers = await offerModel
        .find(completedQuery)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
      if (!offers) throw new CustomError("Offers not found", HttpStatusCode.NOT_FOUND);
      return offers as unknown as Offer[];
    } catch (error) {
      throw error;
    }
  }
  async createOffer(offer: Offer): Promise<Offer> {
    try {
      const createOffer = await offerModel.create(offer);
      if (!createOffer) throw new CustomError("Offer not created", HttpStatusCode.INTERNAL_SERVER_ERROR);
      return createOffer as unknown as Offer;
    } catch (error) {
      throw error;
    }
  }
  async countDocument(agentId:string,query: object, filterData: object): Promise<number> {
    try {
      const completedQuery = {agent_id:agentId, ...query, ...filterData };
      const count = await offerModel.countDocuments(completedQuery);
      return count;
    } catch (error) {
      throw error;
    }
  }
  async getOffer(offerId: string): Promise<Offer> {
    try {
      const offer = await offerModel.findOne({_id:offerId}).populate('package_id');
      if (!offer) throw new CustomError("Offer not found", HttpStatusCode.NOT_FOUND);
      return offer as unknown as Offer;
    } catch (error) {
      throw error;
    }
  }
  async updateOffer(offerId: string, offer: Offer): Promise<Offer> {
    try {
      const updatedOffer = await offerModel.findByIdAndUpdate(offerId, offer, {
        new: true,
      });

      if (!updatedOffer) {
        throw new CustomError("Offer not found", HttpStatusCode.NOT_FOUND);
      }

      return updatedOffer as unknown as Offer;
    } catch (error) {
      throw error;
    }
  }
  async blockNUnblockOffer(
    offerId: string,
    is_active: boolean
  ): Promise<Offer> {
    try {
      const updatedOffer = await offerModel.findOneAndUpdate(
        { _id: offerId },
        { $set: { is_active } },
        { new: true }
      ).populate('package_id');

      if (!updatedOffer) {
        throw new CustomError("Offer not found", HttpStatusCode.NOT_FOUND);
      }

      return updatedOffer as unknown as Offer;
    } catch (error) {
      throw error;
    }
  }
  async getAllOffersToday(today:Date):Promise<Offer[]>{
    try {
      const validOffers = await offerModel.find({
        valid_from: { $lte: today},  
      }).populate('package_id');
      return validOffers as unknown as Offer[];
    } catch (error) {
      console.error("Error fetching expiring offers:", error);
      throw error;
    }
  }
  async getAllOffersExpired(today:Date):Promise<Offer[]>{
    try {
      const expiringOffers = await offerModel.find({
        valid_upto: { $lte: today},  
      }).populate('package_id');
      return expiringOffers as unknown as Offer[];
    } catch (error) {
      console.error("Error fetching expiring offers:", error);
      throw error;
    }
  }
}
