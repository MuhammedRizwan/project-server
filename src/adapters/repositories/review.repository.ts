import Review from "../../domain/entities/review/review";
import { Iuser } from "../../domain/entities/user/user";
import HttpStatusCode from "../../domain/enum/httpstatus";
import { CustomError } from "../../domain/errors/customError";
import reviewModel from "../database/models/review.modal";

export class ReviewRepository {
  async createReview(reviewData: Review): Promise<Review> {
    try {
      const reviewDoc = await reviewModel.create(reviewData);
      if (!reviewDoc) throw new CustomError("Review not created", HttpStatusCode.INTERNAL_SERVER_ERROR);
      const review: Review = reviewDoc.toObject() as unknown as Review;
      return review;
    } catch (error) {
      throw error;
    }
  }
  async editReview(reviewId: string, reviewData: Review): Promise<Review> {
    try {
      const reviewDoc = await reviewModel.findByIdAndUpdate(
        reviewId,
        reviewData,
        { new: true }
      );
      if (!reviewDoc) throw new CustomError("Review not created", HttpStatusCode.INTERNAL_SERVER_ERROR);
      const review: Review = reviewDoc.toObject() as unknown as Review;
      return review;
    } catch (error) {
      throw error;
    }
  }
  async deleteReview(reviewId: string) {
    try {
      const deletedReview = await reviewModel.findByIdAndDelete(reviewId);
      if (deletedReview) {
        return true;
      } else {
        throw new CustomError("Review not deleted", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      throw error;
    }
  }
  async getReviews(packageId: string): Promise<Review[]> {
    try {
      const reviews = await reviewModel.find({ package_id: packageId }).populate<{ user_id: Iuser }>("user_id");
      if (!reviews) throw new CustomError("Reviews not found", HttpStatusCode.NOT_FOUND);
      return reviews as unknown as Review[];
    } catch (error) {
      throw error;
    }
  }
}
