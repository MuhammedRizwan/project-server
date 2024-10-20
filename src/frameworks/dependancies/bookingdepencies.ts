import { MongoBookingRepository } from "../../adapters/repositories/bookingRepository";
import { MongoPackageRepository } from "../../adapters/repositories/packageRepository";
import { BookingUseCase } from "../../application/usecases/booking";
import { RazorPay } from "../services/razorpayService";

const Repositories={
    MongoBookingRepository:new MongoBookingRepository(),
    MongoPackageRepository:new MongoPackageRepository()
}
const Services={
    RazorPay:new RazorPay()
}
const useCase={
    BookingUseCase:new BookingUseCase({Repositories,Services})
}
const BookingDepencies={
    useCase
}
export default BookingDepencies