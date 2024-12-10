export default interface Review {
    _id?: string;
    user_id: string;
    package_id: string;
    rating: number;
    feedback: string;
}
export interface ReviewRepository {
    createReview(reviewData: Review): Promise<Review>;
    editReview(reviewId: string, reviewData: Review): Promise<Review>;
    deleteReview(reviewId: string): Promise<boolean>;
    getReviews(packageId: string): Promise<Review[]>;
  }