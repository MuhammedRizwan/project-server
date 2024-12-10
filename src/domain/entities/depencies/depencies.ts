import { AdminRepository } from "../admin/admin";
import { AgentRepository } from "../agent/agent";
import { BookingRepository, RazorPay } from "../booking/booking";
import { CategoryRepository } from "../category/category";
import { ChatRepository } from "../chat/chat";
import { CouponRepository } from "../coupon/coupon";
import { OfferRepository } from "../offer/offer";
import { OTPRepository } from "../OTP/otp";
import { PackageRepository } from "../package/package";
import { PostRepository } from "../post/post";
import { ReviewRepository } from "../review/review";
import {
  CloudinaryService,
  EmailService,
  GenerateOtp,
  JwtService,
  PasswordService,
} from "../services/service";
import { UserRepository } from "../user/user";
import { WalletRepository } from "../wallet/wallet";

export interface Dependencies {
  Repositories: {
    AdminRepository: AdminRepository;
    UserRepository: UserRepository;
    AgentRepository: AgentRepository;
    OTPRepository: OTPRepository;
    BookingRepository: BookingRepository;
    PackageRepository: PackageRepository;
    CouponRepository: CouponRepository;
    WalletRepository: WalletRepository;
    CategoryRepository: CategoryRepository;
    ChatRepository: ChatRepository;
    OfferRepository: OfferRepository;
    PostRepository: PostRepository;
    ReviewRepository: ReviewRepository;
  };
  Services: {
    EmailService: EmailService;
    JwtService: JwtService;
    GenerateOtp: GenerateOtp;
    PasswordService: PasswordService;
    CloudinaryService: CloudinaryService;
    RazorPay: RazorPay;
  };
}

