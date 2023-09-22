import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WalletService {
    constructor(
        private prisma: PrismaService,
    ) {}

    fetchWallet(userId: number) {
        return this.prisma.wallets.findUnique({
            where: {
                userId: userId
            }
        })
    }

    updateWalletCredits(userId: number, newCreditsAmount: number) {
        return this.prisma.wallets.update({
            where: {
                userId: userId
            },
            data: {
                credits: {
                    set: newCreditsAmount
                }
            }
        });
    }
}