import { OfferRepository } from "../../adapters/repositories/offerRepository";
import { OfferUseCase } from "../../application/usecases/offer";
import { CloudinaryService } from "../services/cloudinaryService";


const Repositories={
    OfferRepository:new OfferRepository()
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