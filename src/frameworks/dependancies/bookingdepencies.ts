import { mongo } from "mongoose";
import { MongoBookingRepository } from "../../adapters/repositories/bookingRepository";
import { MongoPackageRepository } from "../../adapters/repositories/packageRepository";
import { BookingUseCase } from "../../application/usecases/booking";
import { RazorPay } from "../services/razorpayService";
import { MongoCouponRepository } from "../../adapters/repositories/couponRepository";

const Repositories={
    MongoBookingRepository:new MongoBookingRepository(),
    MongoPackageRepository:new MongoPackageRepository(),
    MongoCouponRepository:new MongoCouponRepository()
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