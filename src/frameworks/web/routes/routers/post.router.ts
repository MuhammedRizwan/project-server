import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import { PostController } from "../../../../adapters/controllers/post.controller";
import PostDepencies from "../../../dependancies/post.dependencies";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const controller = {
  post: new PostController(PostDepencies),
};
router.get("/get-all-post", (req: Request, res: Response, next: NextFunction) =>
  controller.post.getAllPost(req, res, next)
);
router.post(
  "/create-post",
  upload.array("images[]", 6),
  (req: Request, res: Response, next: NextFunction) =>
    controller.post.createPost(req, res, next)
);
router.put(
  "/edit-post/:postId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.post.editPost(req, res, next)
);
router.get(
  "/user-post/:userId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.post.userPost(req, res, next)
);
router.get(
  "/one-post/:postId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.post.getPost(req, res, next)
);
router.put(
  "/add-like/:postId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.post.addLike(req, res, next)
);
router.put(
  "/remove-like/:postId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.post.removeLike(req, res, next)
);
router.put(
  "/add-comment/:postId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.post.addComment(req, res, next)
);
router.put(
  "/remove-comment/:postId/:commentId",
  (req: Request, res: Response, next: NextFunction) =>
    controller.post.removeComment(req, res, next)
);

export default router;
