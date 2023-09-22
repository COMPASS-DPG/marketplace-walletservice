import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WalletType } from '@prisma/client';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class UserService {
    constructor(
        private walletService: WalletService,
    ) {}

    async getUserWallet(userId: number) {
        // get user wallet
        const userWallet = await this.walletService.fetchWallet(userId)
        if(userWallet == null) {
            throw new HttpException("Wallet does not exist", HttpStatus.NOT_FOUND);
        }
        // check user
        if(userWallet.type != WalletType.user) {
            throw new HttpException("Wallet does not belong to a user", HttpStatus.BAD_REQUEST);
        }
        return userWallet;
    }

    async reduceUserCredits(userId: number, credits: number) {

        // fetch user wallet
        let userWallet = await this.getUserWallet(userId);

        // check credits
        if(userWallet.credits < credits) {
            throw new HttpException("Not enough credits", HttpStatus.BAD_REQUEST);
        }
        // update user wallet
        userWallet = await this.walletService.updateWalletCredits(userId, userWallet.credits - credits);

        return userWallet;
    }

    async addCreditsToUser(userId: number, credits: number) {

        // fetch user wallet
        let userWallet = await this.getUserWallet(userId);

        // update user wallet
        userWallet = await this.walletService.updateWalletCredits(userId, userWallet.credits + credits);

        return userWallet;
    }
}
