import Wallet from "../../../domain/entities/wallet/wallet";
import { CustomError } from "../../../domain/errors/customError";

interface MongoWalletRepository {
    createWallet(user_id:string): Promise<void>;
    getWallet(user_id:string): Promise<Wallet|null>;
}

interface Dependencies {
    Repositories: {
      MongoWalletRepository: MongoWalletRepository;
    };
  }
  export class WalletUseCase {
    private walletRepository: MongoWalletRepository;
  
    constructor(dependencies: Dependencies) {
      this.walletRepository = dependencies.Repositories.MongoWalletRepository;
    }
    async getAllWallet(user_id:string) {
        const wallet = await this.walletRepository.getWallet(user_id);
        if(!wallet){
            throw new CustomError("Wallet Not Found", 404);
        }
        return wallet;
    }
}