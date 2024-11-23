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

