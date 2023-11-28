import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWalletDto, CreateWalletResponse } from './dto/wallet.dto';
import { WalletType } from '@prisma/client';

@Injectable()
export class WalletService {
    constructor(
        private prisma: PrismaService,
    ) {}

    fetchWallet(userId: string) {
        return this.prisma.wallets.findUnique({
            where: {
                userId
            }
        })
    }

    getCreditsFromWallets(walletType: WalletType) {
        return this.prisma.wallets.findMany({
            where: {
                type: walletType
            },
            select: {
                userId: true,
                credits: true
            }
        })
    }

    updateWalletCredits(userId: string, newCreditsAmount: number) {
        return this.prisma.wallets.update({
            where: {
                userId
            },
            data: {
                credits: {
                    set: newCreditsAmount
                }
            }
        });
    }

    createWallet(createWalletDto: CreateWalletDto): Promise<CreateWalletResponse> {
        return this.prisma.wallets.create({
            data: createWalletDto
        });
    }
}