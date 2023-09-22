import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from 'src/main';

@Injectable()
export class WalletService {

    fetchWallet(userId: number) {
        return prisma.wallets.findUnique({
            where: {
                userId: userId
            }
        })
    }

    updateWalletCredits(userId: number, newCreditsAmount: number) {
        return prisma.wallets.update({
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