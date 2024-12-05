import { CategoryRepository } from "../../adapters/repositories/category.repository";
import { CategoryUseCase } from "../../application/usecases/category";
import { CloudinaryService } from "../services/cloudinaryService";


const Repositories={
    CategoryRepository:new CategoryRepository()
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