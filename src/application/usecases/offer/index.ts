import Offer, { OfferRepository } from "../../../domain/entities/offer/offer";
import { PackageRepository, Packages } from "../../../domain/entities/package/package";
import { CloudinaryService } from "../../../domain/entities/services/service";
import { CustomError } from "../../../domain/errors/customError";


interface Dependencies {
  Repositories: {
    OfferRepository: OfferRepository;
    PackageRepository: PackageRepository;
  };
  Services: {
    CloudinaryService: CloudinaryService;
  };
}
export class OfferUseCase {
  private offerRepository: OfferRepository;
  private cloudinaryService: CloudinaryService;
  private PackageRepository: PackageRepository;
  constructor(dependencies: Dependencies) {
    this.offerRepository = dependencies.Repositories.OfferRepository;
    this.cloudinaryService = dependencies.Services.CloudinaryService;
    this.PackageRepository = dependencies.Repositories.PackageRepository;
  }
  async getAllOffers(
    agentId: string,
    search: string,
    page: number,
    limit: number,
    filter: string
  ) {
    try {
      const query = search
        ? { offer_name: { $regex: search, $options: "i" } }
        : {};
      const filterData =
        filter === "all"
          ? {}
          : { is_active: filter === "blocked" ? true : false };
      const offers = await this.offerRepository.getAllOffers(
        agentId,
        query,
        page,
        limit,
        filterData
      );
      if (!offers) {
        throw new CustomError("Offers not found", 404);
      }
      const totalItems = await this.offerRepository.countDocument(
        agentId,
        query,
        filterData
      );
      if (totalItems === 0) {
        throw new CustomError("offer Not Found", 404);
      }
      return {
        offers,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      };
    } catch (error) {
      throw error;
    }
  }
  async createOffer(
    offer: Offer,
    file: Express.Multer.File | undefined
  ): Promise<Offer> {
    try {
      if (file) {
        offer.image = await this.cloudinaryService.uploadImage(file);
      }
      const newOffer = await this.offerRepository.createOffer(offer);
      if (!newOffer) {
        throw new CustomError("Offer not created", 500);
      }
      return newOffer;
    } catch (error) {
      throw error;
    }
  }
  async getOffer(offerId: string) {
    try {
      const offer = await this.offerRepository.getOffer(offerId);
      if (!offer) {
        throw new CustomError("Offer not found", 404);
      }
      return offer;
    } catch (error) {
      throw error;
    }
  }
  async updateOffer(
    offerId: string,
    offer: Offer,
    file: Express.Multer.File | undefined
  ) {
    try {
      if (file) {
        offer.image = await this.cloudinaryService.uploadImage(file);
      }
      const updatedOffer = await this.offerRepository.updateOffer(
        offerId,
        offer
      );
      if (!updatedOffer) {
        throw new CustomError("Offer not found", 404);
      }
      return updatedOffer;
    } catch (error) {
      throw error;
    }
  }
  async blockNUnblockOffer(offerId: string, is_active: boolean) {
    try {
      const offer = await this.offerRepository.blockNUnblockOffer(
        offerId,
        is_active
      );
      if (!offer) {
        throw new CustomError("Offer not found", 404);
      }
      if (offer.is_active) {
        if (offer.valid_from < new Date()) {
          const { percentage, max_offer, package_id: packages } = offer;
          for (const pkg of packages as Packages[]) {
            const originalPrice = pkg.original_price;
            const discount = (originalPrice * percentage) / 100;
            const maxAllowedDiscount = Math.min(discount, max_offer);
            const offerPrice = originalPrice - maxAllowedDiscount;
            await this.PackageRepository.updateOfferPrice(pkg._id, offerPrice);
          }
        }
      } else {
        if (offer.valid_upto < new Date()) {
          const { package_id: packages } = offer;
          for (const pkg of packages as Packages[]) {
            const offerPrice = pkg.original_price;
            await this.PackageRepository.updateOfferPrice(pkg._id, offerPrice);
          }
        }
      }
      return offer;
    } catch (error) {
      throw error;
    }
  }
  async addofferPackage(agentId: string) {
    try {
      const packageData = this.PackageRepository.addofferPackage(agentId);
      if (!packageData) {
        throw new CustomError("package Not found", 404);
      }
      return packageData;
    } catch (error) {
      throw error;
    }
  }
  async executeOffers() {
    const today = new Date();
    const offerToday = await this.offerRepository.getAllOffersToday(today);
    if (offerToday.length > 0) {
      for (const offer of offerToday) {
        const { percentage, max_offer, package_id: packages } = offer;
        for (const pkg of packages as Packages[]) {
    
          const updatedPrice = pkg.original_price;
          const discount = (updatedPrice * percentage) / 100;
          const maxAllowedDiscount = Math.min(discount, max_offer);

          const offerPrice = updatedPrice - Math.floor(maxAllowedDiscount);
          await this.PackageRepository.updateOfferPrice(pkg._id, offerPrice);
        }
      }
    }
    const offerExpired = await this.offerRepository.getAllOffersExpired(today);
    if (offerExpired.length > 0) {
      for (const offer of offerExpired) {
        const { package_id: packages } = offer;
        for (const pkg of packages as Packages[]) {
          const offerPrice = pkg.original_price;
          await this.PackageRepository.updateOfferPrice(pkg._id, offerPrice);
        }
      }
    }
  }
}
