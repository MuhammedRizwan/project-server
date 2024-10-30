import { MongoWalletRepository } from "../../adapters/repositories/walletRepository";
import { WalletUseCase } from "../../application/usecases/wallet";


const Repositories={
    MongoWalletRepository:new MongoWalletRepository()
}

const useCase={
    WalletUseCase: new WalletUseCase({Repositories})
}

const WalletDepencies={
    useCase
}
export default WalletDepencies