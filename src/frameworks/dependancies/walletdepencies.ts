import { WalletRepository } from "../../adapters/repositories/wallet.repository";
import { WalletUseCase } from "../../application/usecases/wallet";


const Repositories={
    WalletRepository:new WalletRepository()
}

const useCase={
    WalletUseCase: new WalletUseCase({Repositories})
}

const WalletDepencies={
    useCase
}
export default WalletDepencies