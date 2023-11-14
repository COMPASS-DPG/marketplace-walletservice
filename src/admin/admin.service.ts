import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { WalletType } from '@prisma/client';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class AdminService {
    constructor(
        private walletService: WalletService,
    ) {}

    async getAdminWallet(adminId: string) {
        // get admin wallet
        const adminWallet = await this.walletService.fetchWallet(adminId);
        if(adminWallet == null) {
            throw new NotFoundException("Wallet does not exist");
        }

        // check admin
        if(adminWallet.type != WalletType.ADMIN) {
            throw new BadRequestException("Wallet does not belong to admin");
        }
        return adminWallet;
    }

    async addCreditsToAdmin(adminId: string, credits: number) {

        // check admin
        let adminWallet = await this.getAdminWallet(adminId)

        // update provider wallet
        adminWallet = await this.walletService.updateWalletCredits(adminId, adminWallet.credits + credits);
        return adminWallet;
    }
}
