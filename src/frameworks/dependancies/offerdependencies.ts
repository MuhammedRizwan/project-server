import { OfferRepository } from "../../adapters/repositories/offer.repository";
import { PackageRepository } from "../../adapters/repositories/package.repository";
import { OfferUseCase } from "../../application/usecases/offer";
import { CloudinaryService } from "../services/cloudinaryService";


const Repositories={
    OfferRepository:new OfferRepository(),
    PackageRepository:new PackageRepository()
}
const Services={
    CloudinaryService:new CloudinaryService()
}
const useCase={
    OfferUseCase: new OfferUseCase({Repositories,Services})
}

const OfferDepencies={
    useCase
}
export default OfferDepencies