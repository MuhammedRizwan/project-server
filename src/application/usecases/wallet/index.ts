import { WalletRepository } from "../../../domain/entities/wallet/wallet";
import { CustomError } from "../../../domain/errors/customError";

interface Dependencies {
    Repositories: {
      WalletRepository: WalletRepository;
    };
  }
  export class WalletUseCase {
    private walletRepository: WalletRepository;
  
    constructor(dependencies: Dependencies) {
      this.walletRepository = dependencies.Repositories.WalletRepository;
    }
    async getAllWallet(user_id:string) {
        const wallet = await this.walletRepository.getWallet(user_id);
        if(!wallet){
            throw new CustomError("Wallet Not Found", 404);
        }
        return wallet;
    }
}