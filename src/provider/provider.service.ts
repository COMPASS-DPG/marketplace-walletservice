import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { WalletType, wallets } from '@prisma/client';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class ProviderService {
    constructor(
        private walletService: WalletService,
    ) {}

    async getProviderWallet(providerId: string) {
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

    async addCreditsToProvider(providerId: string, credits: number, providerWallet: wallets) {

        // update provider wallet
        providerWallet = await this.walletService.updateWalletCredits(providerId, providerWallet.credits + credits);
        return providerWallet;
    }

    async reduceProviderCredits(consumerId: string, credits: number) {

        // fetch wallet
        let providerWallet = await this.getProviderWallet(consumerId);

        // check credits
        if(providerWallet.credits < credits) {
            throw new BadRequestException("Not enough credits");
        }
        // update wallet
        providerWallet = await this.walletService.updateWalletCredits(consumerId, providerWallet.credits - credits);

        return providerWallet;
    }
}
