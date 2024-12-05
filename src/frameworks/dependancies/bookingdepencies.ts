
import { BookingRepository } from "../../adapters/repositories/booking.repository";
import { PackageRepository } from "../../adapters/repositories/package.repository";
import { BookingUseCase } from "../../application/usecases/booking";
import { RazorPay } from "../services/razorpayService";
import { CouponRepository } from "../../adapters/repositories/coupon.repository";
import { WalletRepository } from "../../adapters/repositories/wallet.repository";

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