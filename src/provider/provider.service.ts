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
            throw new NotFoundException;
        }

        // check provider
        if(providerWallet.type != WalletType.provider) {
            throw new BadRequestException;
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
