import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
            throw new NotFoundException("Wallet does not exist");
        }

        // check provider
        if(providerWallet.type != WalletType.provider) {
            throw new BadRequestException("Wallet does not belong to provider");
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

    async reduceProviderCredits(enduserId: number, credits: number) {

        // fetch wallet
        let providerWallet = await this.getProviderWallet(enduserId);

        // check credits
        if(providerWallet.credits < credits) {
            throw new BadRequestException("Not enough credits");
        }
        // update wallet
        providerWallet = await this.walletService.updateWalletCredits(enduserId, providerWallet.credits - credits);

        return providerWallet;
    }
}
