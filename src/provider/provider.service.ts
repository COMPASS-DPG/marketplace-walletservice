import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WalletType } from '@prisma/client';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class ProviderService {
    constructor(
        private walletService: WalletService,
    ) {}

    async getProviderWallet(providerId: number) {
        // get provider wallet
        const providerWallet = await this.walletService.fetchWallet(providerId)
        if(providerWallet == null) {
            throw new HttpException("Wallet does not exist", HttpStatus.NOT_FOUND);
        }

        // check provider
        if(providerWallet.type != WalletType.provider) {
            throw new HttpException("Wallet does not belong to provider", HttpStatus.BAD_REQUEST);
        }
        return providerWallet;
    }

    async addCreditsToProvider(providerId: number, credits: number) {

        // check provider
        let providerWallet = await this.getProviderWallet(providerId)

        // update provider wallet
        providerWallet = await this.walletService.updateWalletCredits(providerId, providerWallet.credits + credits);
        return providerWallet;
    }

}
