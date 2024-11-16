import { BookingRepository } from "../../adapters/repositories/bookingRepository";
import { ReviewRepository } from "../../adapters/repositories/reviewRepository";
import { ReviewUseCase } from "../../application/usecases/review";

const Repositories = {
  ReviewRepository: new ReviewRepository(),
  BookingRepository: new BookingRepository(),
};

const useCase = {
  ReviewUseCase: new ReviewUseCase({ Repositories }),
};

const ReviewDependancies = {
  useCase,
};
export default ReviewDependancies;
