
import { PostRepository } from "../../adapters/repositories/post.repository";
import { PostUseCase } from "../../application/usecases/post/post.usecase";
import { CloudinaryService } from "../services/cloudinaryService";


const Repositories={
    PostRepository:new PostRepository()
}
const Services={
    CloudinaryService:new CloudinaryService()
}
const useCase={
    PostUseCase: new PostUseCase({Repositories,Services})
}

const PostDepencies={
    useCase
}
export default PostDepencies