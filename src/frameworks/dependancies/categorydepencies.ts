import { MongoCategoryRepository } from "../../adapters/repositories/categoryRepository";
import { CategoryUseCase } from "../../application/usecases/category";
import { CloudinaryService } from "../services/cloudinaryService";


const Repositories={
    MongoCategoryRepository:new MongoCategoryRepository()
}
const Services={
    CloudinaryService:new CloudinaryService()
}
const useCase={
    CategoryUseCase: new CategoryUseCase({Repositories,Services})
}

const CategoryDepencies={
    useCase
}
export default CategoryDepencies