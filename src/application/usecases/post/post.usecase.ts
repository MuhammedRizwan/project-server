import { Dependencies } from "../../../domain/entities/depencies/depencies";
import Post, { PostRepository } from "../../../domain/entities/post/post";
import { CloudinaryService } from "../../../domain/entities/services/service";
import HttpStatusCode from "../../../domain/enum/httpstatus";
import { CustomError } from "../../../domain/errors/customError";



export class PostUseCase {
  private _postRepository: PostRepository;
  private _cloudinaryService: CloudinaryService;
  constructor(dependencies: Dependencies) {
    this._postRepository = dependencies.Repositories.PostRepository;
    this._cloudinaryService = dependencies.Services.CloudinaryService;
  }
  async getAllPost() {
    try {
      const postData = await this._postRepository.getAllPost();
      if (postData.length == 0) {
        throw new CustomError("No post found", HttpStatusCode.NOT_FOUND);
      }
      return postData;
    } catch (error) {
      throw error;
    }
  }
  async createPost(
    post: Post,
    file:
      | { [fieldname: string]: Express.Multer.File[] }
      | Express.Multer.File[]
      | undefined
  ) {
    try {
      if (Array.isArray(file)) {
        post.image = await Promise.all(
          file.map(async (image) => {
            const imageUrl = await this._cloudinaryService.uploadImage(image);
            return imageUrl;
          })
        );
      }
      const createdPost = this._postRepository.createPost(post);
      if (!createdPost) {
        throw new CustomError("couldn't create post", HttpStatusCode.NOT_FOUND);
      }
      return createdPost;
    } catch (error) {
      throw error;
    }
  }
  async editPost(
    postId: string,
    post: Post,
    file:
      | { [fieldname: string]: Express.Multer.File[] }
      | Express.Multer.File[]
      | undefined
  ) {
    try {
      if (Array.isArray(file)) {
        post.image = await Promise.all(
          file.map(async (image) => {
            const imageUrl = await this._cloudinaryService.uploadImage(image);
            return imageUrl;
          })
        );
      }
      const editedPost = this._postRepository.editPost(postId, post);
      if (!editedPost) {
        throw new CustomError("Cannot Edit Post", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      return editedPost;
    } catch (error) {
      throw error;
    }
  }
  async userPost(userId: string) {
    try {
      const postData = await this._postRepository.userPost(userId);
      if (!postData) {
        throw new CustomError("cannot fetch post", HttpStatusCode.NOT_FOUND);
      }
      return postData;
    } catch (error) {
      throw error;
    }
  }
  async getPost(postId: string) {
    try {
      const postData = await this._postRepository.getPost(postId);
      if (!postData) {
        throw new CustomError("cannot found Post", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      return postData;
    } catch (error) {
      throw error;
    }
  }
  async addLike(postId: string, userId: string) {
    try {
      const postData = await this._postRepository.addLike(postId, userId);
      if (!postData) {
        throw new CustomError("cannot found Post", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      return postData;
    } catch (error) {
      throw error;
    }
  }
  async removeLike(postId: string, userId: string) {
    try {
      const postData = await this._postRepository.removeLike(postId, userId);
      if (!postData) {
        throw new CustomError("cannot found Post", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      return postData;
    } catch (error) {
      throw error;
    }
  }
  async addComment(postId: string,userId: string, comment: string ) {
    try {
      const postData = await this._postRepository.addComment(
        postId,
        userId,
        comment
      );
      if (!postData) {
        throw new CustomError("cannot found Post", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      return postData;
    } catch (error) {
      throw error;
    }
  }
  async removeComment(postId: string, commentId: string) {
    try {
      const postData = await this._postRepository.removeComment(postId, commentId);
      if (!postData) {
        throw new CustomError("cannot found Post", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      return postData;
    } catch (error) {
      throw error;
    }
  }
}
