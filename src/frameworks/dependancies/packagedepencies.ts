import { PackageRepository } from "../../adapters/repositories/packageRepository";
import { packageUseCase } from "../../application/usecases/package";
import { CloudinaryService } from "../services/cloudinaryService";


const Repositories={
    PackageRepository:new PackageRepository()
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