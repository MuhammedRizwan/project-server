import { Dependencies } from "../../../domain/entities/depencies/depencies";
import { WalletRepository } from "../../../domain/entities/wallet/wallet";
import HttpStatusCode from "../../../domain/enum/httpstatus";
import { CustomError } from "../../../domain/errors/customError";

export class WalletUseCase {
  private walletRepository: WalletRepository;

  constructor(dependencies: Dependencies) {
    this.walletRepository = dependencies.Repositories.WalletRepository;
  }
  async getAllWallet(user_id: string) {
    const wallet = await this.walletRepository.getWallet(user_id);
    if (!wallet) {
      throw new CustomError("Wallet Not Found", HttpStatusCode.NOT_FOUND);
    }
    return wallet;
  }
}
