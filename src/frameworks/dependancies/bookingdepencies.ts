import { MongoBookingRepository } from "../../adapters/repositories/bookingRepository";
import { MongoPackageRepository } from "../../adapters/repositories/packageRepository";
import { BookingUseCase } from "../../application/usecases/booking";

const Repositories={
    MongoBookingRepository:new MongoBookingRepository(),
    MongoPackageRepository:new MongoPackageRepository()
}
const useCase={
    BookingUseCase:new BookingUseCase({Repositories})
}
const BookingDepencies={
    useCase
}
export default BookingDepencies