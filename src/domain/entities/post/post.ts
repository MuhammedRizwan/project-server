import { Types } from "mongoose";


interface Like {
  liked_user: string; 
  emoji?: string; 
  created_At?: Date; 
}

interface Comment {
  user_id: string;
  message: string;
  created_At?: Date; 
}


export default interface Post {
  _id?: string; 
  user_id: string;
  image?: string[]; 
  caption: string; 
  location: string;
  like: Like[]; 
  comment: Comment[]; 
  createdAt?: Date; 
  updatedAt?: Date; 
}

export interface PostRepository {
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

