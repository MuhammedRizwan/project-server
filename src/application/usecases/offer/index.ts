interface OfferRepository{}
interface CloudinaryService{}

interface Dependencies {
    Repositories: {
      OfferRepository: OfferRepository;
    };
    Services: {
      CloudinaryService: CloudinaryService;
    };
  }
export class OfferUseCase {
    private offerRepository: OfferRepository;
    private cloudinaryService: CloudinaryService;
    constructor(dependencies: Dependencies) {
      this.offerRepository = dependencies.Repositories.OfferRepository;
      this.cloudinaryService = dependencies.Services.CloudinaryService;
    }
}