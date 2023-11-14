import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { WalletType, wallets } from '@prisma/client';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class ConsumerService {
    constructor(
        private walletService: WalletService,
    ) {}

    async getConsumerWallet(consumerId: string) {
        // get consumer wallet
        const consumerWallet = await this.walletService.fetchWallet(consumerId)
        if(consumerWallet == null) {
            throw new NotFoundException("Wallet does not exist");
        }
        // check consumer
        if(consumerWallet.type != WalletType.CONSUMER) {
            throw new BadRequestException("Wallet does not belong to a consumer");
        }
        return consumerWallet;
    }

    async reduceConsumerCredits(consumerId: string, credits: number, consumerWallet?: wallets) {

        // fetch consumer wallet if not passed
        if(!consumerWallet)
            consumerWallet = await this.getConsumerWallet(consumerId);
        // check credits
        if(consumerWallet.credits < credits) {
            throw new BadRequestException("Not enough credits");
        }
        // update consumer wallet
        consumerWallet = await this.walletService.updateWalletCredits(consumerId, consumerWallet.credits - credits);

        return consumerWallet;
    }

    async addCreditsToConsumer(consumerId: string, credits: number) {

        // fetch consumer wallet
        let consumerWallet = await this.getConsumerWallet(consumerId);

        // update consumer wallet
        consumerWallet = await this.walletService.updateWalletCredits(consumerId, consumerWallet.credits + credits);

        return consumerWallet;
    }
}
