import Post from "../../domain/entities/post/post";
import postModel from "../database/models/postModel";

export class PostRepository {
  async getAllPost(): Promise<Post[]> {
    try {
      const postData = await postModel
        .find()
        .populate("user_id")
        .populate("comment.user_id")
        .sort({ _id: -1 });
      return postData as unknown as Post[];
    } catch (error) {
      throw error;
    }
  }
  async createPost(post: Post): Promise<Post> {
    try {
      const createPost = await postModel.create(post);
      return createPost as unknown as Post;
    } catch (error) {
      throw error;
    }
  }
  async editPost(postId: string, post: Post): Promise<Post> {
    try {
      const postData = await postModel.findByIdAndUpdate(postId, post, {
        new: true,
      });
      return postData as unknown as Post;
    } catch (error) {
      throw error;
    }
  }

  async userPost(userId: string): Promise<Post[]> {
    try {
      const postData = await postModel
        .find({ user_id: userId })
        .sort({ created_at: -1 });
      return postData as unknown as Post[];
    } catch (error) {
      throw error;
    }
  }
  async getPost(postId: string): Promise<Post> {
    try {
      const postData = await postModel.findOne({ _id: postId });
      return postData as unknown as Post;
    } catch (error) {
      throw error;
    }
  }
  async addLike(postId: string, userId: string): Promise<Post> {
    try {
      const postData = await postModel.findOneAndUpdate(
        { _id: postId },
        { $addToSet: { like: { liked_user: userId } } },
        { new: true }
      );
      return postData as unknown as Post;
    } catch (error) {
      throw error;
    }
  }
  async removeLike(postId: string, userId: string): Promise<Post> {
    try {
      const postData = await postModel.findOneAndUpdate(
        { _id: postId },
        { $pull: { like: { liked_user: userId } } },
        { new: true }
      );
      return postData as unknown as Post;
    } catch (error) {
      throw error;
    }
  }
  async addComment(postId: string, userId: string, comment: string) {
    try {
      const postData = await postModel.findOneAndUpdate(
        { _id: postId },
        { $addToSet: { comment: { user_id: userId, message: comment } } },
        { new: true }
      );
      return postData as unknown as Post;
    } catch (error) {
      throw error;
    }
  }
  async removeComment(postId: string, commentId: string) {
    try {
      const postData = await postModel.findOneAndUpdate(
        { _id: postId },
        { $pull: { comment: { _id: commentId } } },
        { new: true }
      );
      return postData as unknown as Post;
    } catch (error) {
      throw error;
    }
  }
}
