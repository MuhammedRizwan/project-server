import { MongoCouponRepository } from "../../adapters/repositories/couponRepository";
import { CouponUseCase } from "../../application/usecases/coupon/intex";

const Repositories = {
  MongoCouponRepository: new MongoCouponRepository(),
};

const useCase = {
  CouponUseCase: new CouponUseCase({ Repositories }),
};

const CouponDependancies = {
  useCase,
};
export default CouponDependancies;
