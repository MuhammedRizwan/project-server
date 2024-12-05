import { BookingRepository } from "../../adapters/repositories/booking.repository";
import { ReviewRepository } from "../../adapters/repositories/review.repository";
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
