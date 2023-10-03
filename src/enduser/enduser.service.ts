import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { WalletType } from '@prisma/client';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class EnduserService {
    constructor(
        private walletService: WalletService,
    ) {}

    async getEnduserWallet(enduserId: number) {
        // get enduser wallet
        const enduserWallet = await this.walletService.fetchWallet(enduserId)
        if(enduserWallet == null) {
            throw new NotFoundException("Wallet does not exist");
        }
        // check enduser
        if(enduserWallet.type != WalletType.enduser) {
            throw new BadRequestException("Wallet does not belong to a enduser");
        }
        return enduserWallet;
    }

    async reduceEnduserCredits(enduserId: number, credits: number) {

        // fetch enduser wallet
        let enduserWallet = await this.getEnduserWallet(enduserId);

        // check credits
        if(enduserWallet.credits < credits) {
            throw new BadRequestException("Not enough credits");
        }
        // update enduser wallet
        enduserWallet = await this.walletService.updateWalletCredits(enduserId, enduserWallet.credits - credits);

        return enduserWallet;
    }

    async addCreditsToEnduser(enduserId: number, credits: number) {

        // fetch enduser wallet
        let enduserWallet = await this.getEnduserWallet(enduserId);

        // update enduser wallet
        enduserWallet = await this.walletService.updateWalletCredits(enduserId, enduserWallet.credits + credits);

        return enduserWallet;
    }
}
