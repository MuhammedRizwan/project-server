import { NextFunction, Request, Response } from "express";
import { ReviewUseCase } from "../../application/usecases/review";

interface Dependencies {
  useCase: {
    ReviewUseCase: ReviewUseCase;
  };
}

export class ReviewController {
  private reviewUseCase: ReviewUseCase;

  constructor(dependencies: Dependencies) {
    this.reviewUseCase = dependencies.useCase.ReviewUseCase;
  }

  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId } = req.params;
      const booking = await this.reviewUseCase.createReview(bookingId,req.body);
      return res
        .status(200)
        .json({
          success: true,
          message: "Review created successfully",
          booking,
        });
    } catch (error) {
      next(error);
    }
  }
  async editReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviewId } = req.params;
      const review = await this.reviewUseCase.editReview(reviewId,req.body);
      return res
        .status(200)
        .json({ success: true, message: "Review edited successfully", review });
    } catch (error) {
      next(error);
    }
  }
  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId, reviewId } = req.params;
      const booking = await this.reviewUseCase.deleteReview(bookingId,reviewId);
      return res
        .status(200)
        .json({ success: true, message: "Review deleted successfully", booking });
    } catch (error) {
      next(error);
    }
  }
  async getReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { packageId } = req.params;
      const review = await this.reviewUseCase.getReviews(packageId);
      return res
        .status(200)
        .json({ success: true, message: "Reviews fetched successfully", review });
    } catch (error) {
      next(error);
    }
  }
}
