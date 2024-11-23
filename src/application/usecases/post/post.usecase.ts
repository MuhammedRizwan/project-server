import Post from "../../../domain/entities/post/post";
import { CustomError } from "../../../domain/errors/customError";

interface PostRepository {
  getAllPost(): Promise<Post[]>;
  createPost(post: Post): Promise<Post>;
  editPost(postId: string, post: Post): Promise<Post>;
  userPost(userId: string): Promise<Post[]>;
  getPost(postId: string): Promise<Post>;
  addLike(postId: string, userId: string): Promise<Post>;
  removeLike(postId: string, userId: string): Promise<Post>;
  addComment(postId: string, userId: string, comment: string): Promise<Post>;
  removeComment(postId: string, commentId: string): Promise<Post>;
}

interface CloudinaryService {
  uploadImage(file: Express.Multer.File | undefined): Promise<string>;
}

interface Dependencies {
  Repositories: {
    PostRepository: PostRepository;
  };
  Services: {
    CloudinaryService: CloudinaryService;
  };
}
export class PostUseCase {
  private postRepository: PostRepository;
  private cloudinaryService: CloudinaryService;
  constructor(dependencies: Dependencies) {
    this.postRepository = dependencies.Repositories.PostRepository;
    this.cloudinaryService = dependencies.Services.CloudinaryService;
  }
  async getAllPost() {
    try {
      const postData = await this.postRepository.getAllPost();
      if (postData.length == 0) {
        throw new CustomError("No post found", 404);
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
            const imageUrl = await this.cloudinaryService.uploadImage(image);
            return imageUrl;
          })
        );
      }
      const createdPost = this.postRepository.createPost(post);
      if (!createdPost) {
        throw new CustomError("couldn't create post", 404);
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
            const imageUrl = await this.cloudinaryService.uploadImage(image);
            return imageUrl;
          })
        );
      }
      const editedPost = this.postRepository.editPost(postId, post);
      if (!editedPost) {
        throw new CustomError("Cannot Edit Post", 500);
      }
      return editedPost;
    } catch (error) {
      throw error;
    }
  }
  async userPost(userId: string) {
    try {
      const postData = await this.postRepository.userPost(userId);
      if (!postData) {
        throw new CustomError("cannot fetch post", 404);
      }
      return postData;
    } catch (error) {
      throw error;
    }
  }
  async getPost(postId: string) {
    try {
      const postData = await this.postRepository.getPost(postId);
      if (!postData) {
        throw new CustomError("cannot found Post", 500);
      }
      return postData;
    } catch (error) {
      throw error;
    }
  }
  async addLike(postId: string, userId: string) {
    try {
      const postData = await this.postRepository.addLike(postId, userId);
      if (!postData) {
        throw new CustomError("cannot found Post", 500);
      }
      return postData;
    } catch (error) {
      throw error;
    }
  }
  async removeLike(postId: string, userId: string) {
    try {
      const postData = await this.postRepository.removeLike(postId, userId);
      if (!postData) {
        throw new CustomError("cannot found Post", 500);
      }
      return postData;
    } catch (error) {
      throw error;
    }
  }
  async addComment(postId: string,userId: string, comment: string ) {
    try {
      const postData = await this.postRepository.addComment(
        postId,
        userId,
        comment
      );
      if (!postData) {
        throw new CustomError("cannot found Post", 500);
      }
      return postData;
    } catch (error) {
      throw error;
    }
  }
  async removeComment(postId: string, commentId: string) {
    try {
      const postData = await this.postRepository.removeComment(postId, commentId);
      if (!postData) {
        throw new CustomError("cannot found Post", 500);
      }
      return postData;
    } catch (error) {
      throw error;
    }
  }
}
