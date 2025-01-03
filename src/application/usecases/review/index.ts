import { Booking, BookingRepository } from "../../../domain/entities/booking/booking";
import { Dependencies } from "../../../domain/entities/depencies/depencies";
import Review, { ReviewRepository } from "../../../domain/entities/review/review";
import HttpStatusCode from "../../../domain/enum/httpstatus";
import { CustomError } from "../../../domain/errors/customError";




export class ReviewUseCase {
  private _reviewRepository: ReviewRepository;
  private _bookingRepository: BookingRepository;
  constructor(dependencies: Dependencies) {
    this._reviewRepository = dependencies.Repositories.ReviewRepository;
    this._bookingRepository = dependencies.Repositories.BookingRepository;
  }

  async createReview(bookingId: string, reviewData: Review): Promise<Booking> {
    try {
      const review = await this._reviewRepository.createReview(reviewData);
      if (!review) throw new CustomError("Review not created", HttpStatusCode.INTERNAL_SERVER_ERROR);
      const addToBooking = await this._bookingRepository.addReview(
        bookingId,
        review._id
      );
      if (!addToBooking)
        throw new CustomError("Review not added to booking", HttpStatusCode.INTERNAL_SERVER_ERROR);
      return addToBooking;
    } catch (error) {
      throw error;
    }
  }
  async editReview(reviewId: string, reviewData: Review): Promise<Review> {
    try {
      const review = await this._reviewRepository.editReview(
        reviewId,
        reviewData
      );
      if (!review) throw new CustomError("Review not created", HttpStatusCode.INTERNAL_SERVER_ERROR);
      return review;
    } catch (error) {
      throw error;
    }
  }
  async deleteReview(bookingId: string, reviewId: string) {
    try {
      const review = await this._reviewRepository.deleteReview(reviewId);
      if (!review) throw new CustomError("Review not created", HttpStatusCode.INTERNAL_SERVER_ERROR);
      const deletedFromBooking = await this._bookingRepository.deleteReview(
        bookingId
      );
      if (!deletedFromBooking)
        throw new CustomError("Review not deleted from booking", HttpStatusCode.INTERNAL_SERVER_ERROR);
      return deletedFromBooking;
    } catch (error) {
      throw error;
    }
  }
  async getReviews(packageId: string): Promise<Review[]> {
    try {
      const reviews = await this._reviewRepository.getReviews(packageId);
      if (!reviews) throw new CustomError("Reviews not found", HttpStatusCode.NOT_FOUND);
      return reviews;
    } catch (error) {
      throw error;
    }
  }
}
