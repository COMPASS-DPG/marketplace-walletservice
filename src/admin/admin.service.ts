import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { WalletType } from '@prisma/client';
import { prisma } from 'src/main';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class AdminService {
    constructor(
        private walletService: WalletService,
    ) {}

    async getAdminWallet(adminId: number) {
        // get admin wallet
        const adminWallet = await this.walletService.fetchWallet(adminId);
        if(adminWallet == null) {
            throw new NotFoundException;
        }

        // check admin
        if(adminWallet.type != WalletType.admin) {
            throw new UnauthorizedException;
        }
        return adminWallet;
    }
}
