import { MongoPackageRepository } from "../../adapters/repositories/packageRepository";
import { packageUseCase } from "../../application/usecases/package";
import { CloudinaryService } from "../services/cloudinaryService";


const Repositories={
    MongoPackageRepository:new MongoPackageRepository()
}
const services={
    CloudinaryService:new CloudinaryService()
}
const useCase={
    packageUseCase:new packageUseCase({Repositories,services})
}
const PackageDepencies={
    useCase
}
export default PackageDepencies