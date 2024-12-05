import { CouponRepository } from "../../adapters/repositories/coupon.repository";
import { CouponUseCase } from "../../application/usecases/coupon/intex";

const Repositories = {
  CouponRepository: new CouponRepository(),
};

const useCase = {
  CouponUseCase: new CouponUseCase({ Repositories }),
};

const CouponDependancies = {
  useCase,
};
export default CouponDependancies;
