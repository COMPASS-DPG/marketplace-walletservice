import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWalletDto, CreateWalletResponse } from './dto/wallet.dto';

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