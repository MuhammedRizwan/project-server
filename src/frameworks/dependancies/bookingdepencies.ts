
import { BookingRepository } from "../../adapters/repositories/bookingRepository";
import { PackageRepository } from "../../adapters/repositories/packageRepository";
import { BookingUseCase } from "../../application/usecases/booking";
import { RazorPay } from "../services/razorpayService";
import { CouponRepository } from "../../adapters/repositories/couponRepository";
import { WalletRepository } from "../../adapters/repositories/walletRepository";

const Repositories={
    BookingRepository:new BookingRepository(),
    PackageRepository:new PackageRepository(),
    CouponRepository:new CouponRepository(),
    WalletRepository:new WalletRepository()
}
const Services={
    RazorPay:new RazorPay()
}
const useCase={
    BookingUseCase:new BookingUseCase({ Repositories,Services})
}
const BookingDepencies={
    useCase
}
export default BookingDepencies