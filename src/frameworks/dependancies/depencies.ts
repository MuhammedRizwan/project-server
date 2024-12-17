import { AdminRepository } from "../../adapters/repositories/admin.repository";
import { AgentRepository } from "../../adapters/repositories/agent.repository";
import { BookingRepository } from "../../adapters/repositories/booking.repository";
import { CategoryRepository } from "../../adapters/repositories/category.repository";
import ChatRepository from "../../adapters/repositories/chat.repository";
import { CouponRepository } from "../../adapters/repositories/coupon.repository";
import { OfferRepository } from "../../adapters/repositories/offer.repository";
import { OTPRepository } from "../../adapters/repositories/otp.repositories";
import { PackageRepository } from "../../adapters/repositories/package.repository";
import { PostRepository } from "../../adapters/repositories/post.repository";
import { ReviewRepository } from "../../adapters/repositories/review.repository";
import { UserRepository } from "../../adapters/repositories/user.repositories";
import { WalletRepository } from "../../adapters/repositories/wallet.repository";
import { NotificationRepository } from "../../adapters/repositories/notification.repository";
import { CloudinaryService } from "../services/cloudinaryService";
import { EmailService } from "../services/emailService";
import { GenerateOtp } from "../services/genarateOTP";
import { JwtService } from "../services/jwtService";
import { PasswordService } from "../services/passwordService";
import { RazorPay } from "../services/razorpayService";
import { AdminUseCase } from "../../application/usecases/admin";
import { AgentUseCase } from "../../application/usecases/agent";
import { AgentVerification } from "../../application/usecases/agent/agentVerifcation";
import { BookingUseCase } from "../../application/usecases/booking";
import { CategoryUseCase } from "../../application/usecases/category";
import { ChatmessageUseCase } from "../../application/usecases/chatmessage";
import { CouponUseCase } from "../../application/usecases/coupon/intex";
import { OfferUseCase } from "../../application/usecases/offer";
import { packageUseCase } from "../../application/usecases/package";
import { PostUseCase } from "../../application/usecases/post/post.usecase";
import { ReviewUseCase } from "../../application/usecases/review";
import { UserUseCase } from "../../application/usecases/user";
import { Verification } from "../../application/usecases/user/userVerification";
import { WalletUseCase } from "../../application/usecases/wallet";
import { SocketUseCase } from "../../application/usecases/socket";
import NotificationUseCase from "../../application/usecases/notification";

const Repositories = {
  AdminRepository: new AdminRepository(),
  OTPRepository: new OTPRepository(),
  UserRepository: new UserRepository(),
  AgentRepository: new AgentRepository(),
  BookingRepository: new BookingRepository(),
  PackageRepository: new PackageRepository(),
  CouponRepository: new CouponRepository(),
  WalletRepository: new WalletRepository(),
  CategoryRepository: new CategoryRepository(),
  ChatRepository: new ChatRepository(),
  OfferRepository: new OfferRepository(),
  PostRepository: new PostRepository(),
  ReviewRepository: new ReviewRepository(),
  NotificationRepository: new NotificationRepository(),
};
const Services = {
  EmailService: new EmailService(),
  GenerateOtp: new GenerateOtp(),
  JwtService: new JwtService(),
  PasswordService: new PasswordService(),
  CloudinaryService: new CloudinaryService(),
  RazorPay: new RazorPay(),
};

const useCase = {
  AdminUseCase: new AdminUseCase({ Repositories, Services }),
  AgentUseCase: new AgentUseCase({ Repositories, Services }),
  AgentVerification: new AgentVerification({ Repositories, Services }),
  BookingUseCase: new BookingUseCase({ Repositories, Services }),
  CategoryUseCase: new CategoryUseCase({ Repositories, Services }),
  SocketUseCase: new SocketUseCase({ Repositories, Services }),
  ChatmessageUseCase: new ChatmessageUseCase({ Repositories, Services }),
  CouponUseCase: new CouponUseCase({ Repositories, Services }),
  OfferUseCase: new OfferUseCase({ Repositories, Services }),
  packageUseCase: new packageUseCase({ Repositories, Services }),
  PostUseCase: new PostUseCase({ Repositories, Services }),
  ReviewUseCase: new ReviewUseCase({ Repositories, Services }),
  UserUseCase: new UserUseCase({ Repositories, Services }),
  Verification: new Verification({ Repositories, Services }),
  WalletUseCase: new WalletUseCase({ Repositories, Services }),
  NotificationUseCase: new NotificationUseCase({ Repositories, Services }),
};

const Depencies = {
  useCase,
};
export default Depencies;
