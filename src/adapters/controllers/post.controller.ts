import { NextFunction, Request, Response } from "express";
import { PostUseCase } from "../../application/usecases/post/post.usecase";

interface Dependencies {
  useCase: {
    PostUseCase: PostUseCase;
  };
}

export class PostController {
  private _postUseCase: PostUseCase;
  constructor(dependencies: Dependencies) {
    this._postUseCase = dependencies.useCase.PostUseCase;
  }
  async getAllPost(req:Request,res:Response,next:NextFunction){
    try {
        const post=await this._postUseCase.getAllPost()
        return res.status(200).json({success:true,message:"fetched all data",post})
    } catch (error) {
       next(error) 
    }
  }
  
  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = this._postUseCase.createPost(req.body, req.files);
      return res
        .status(201)
        .json({ success: true, message: "Post created", post });
    } catch (error) {
      next(error);
    }
  }
  async editPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const post = await this._postUseCase.editPost(postId, req.body, req.files);
      return res
        .status(200)
        .json({ success: true, message: "Post Edited", post });
    } catch (error) {
      next(error);
    }
  }
  async userPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const post = await this._postUseCase.userPost(userId);
      return res
        .status(200)
        .json({ success: true, message: "fetched user post", post });
    } catch (error) {
      next(error);
    }
  }
  async getPost(req:Request,res:Response,next:NextFunction){
    try {
        const {postId}=req.params
        const post=await this._postUseCase.getPost(postId)
        return res.status(200).json({success:true,message:"fetched one post",post})
    } catch (error) {
        next(error)
    }
  }
  async addLike(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId} = req.params;
      const { userId } = req.body;
      const post = await this._postUseCase.addLike(postId, userId);
      return res
        .status(200)
        .json({ success: true, message: "updated like", post });
    } catch (error) {
      next(error)
    }
  }
  async removeLike(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId} = req.params;
      const { userId } = req.body;
      const post = await this._postUseCase.removeLike(postId, userId);
      return res
        .status(200)
        .json({ success: true, message: "updated like", post });
    } catch (error) {
      next(error)
    }
  }
  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const { userId,commentText } = req.body;
      const post = await this._postUseCase.addComment(postId, userId, commentText);
      return res
        .status(200)
        .json({ success: true, message: "updated comment", post });
    } catch (error) {
      next(error)
    }
  }
  async removeComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId, commentId } = req.params;
      const post = await this._postUseCase.removeComment(
        postId,
        commentId
      );
      return res
        .status(200)
        .json({ success: true, message: "updated comment", post });
    } catch (error) {
      next(error)
    }
  }
}
