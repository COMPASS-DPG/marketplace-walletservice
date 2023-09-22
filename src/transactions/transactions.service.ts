import { Injectable } from '@nestjs/common';
import { TransactionType, WalletType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionService {
    constructor(
        private prisma: PrismaService,
    ) {}

    fetchAllUsersTransactions() {
        return this.prisma.transactions.findMany({
            where: {
                OR: [{
                    from: {
                        type: WalletType.user
                    }
                }, {
                    to: {
                        type: WalletType.user
                    }
                }]
            }
        });
    }

    fetchTransactionsOfOneSystemActor(userId: number) {
        return this.prisma.transactions.findMany({
            where: {
                OR: [{
                    from: {
                        userId: userId,
                    }
                }, {
                    to: {
                        userId: userId,
                    }
                }]
            }
        });
    }

    fetchAllAdminProviderTransactions() {
        return this.prisma.transactions.findMany({
            where: {
                from: {
                    type: WalletType.provider
                },
                to: {
                    type: WalletType.admin
                }
                
            }
        });
    }

    createTransaction(credits: number, fromWalletId: number, toWalletId: number, transactionType: TransactionType, description?: string) {
        return this.prisma.transactions.create({
            data: {
                credits: credits,
                type: transactionType,
                description: description,
                fromId: fromWalletId,
                toId: toWalletId,
            }
        });
    }
}
