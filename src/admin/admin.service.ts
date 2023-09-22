import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WalletType } from '@prisma/client';
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
            throw new HttpException("Wallet does not exist", HttpStatus.NOT_FOUND);
        }

        // check admin
        if(adminWallet.type != WalletType.admin) {
            throw new HttpException("Wallet does not belong to admin", HttpStatus.BAD_REQUEST);
        }
        return adminWallet;
    }
}
