import { Injectable } from '@nestjs/common';
import { TransactionType, WalletType } from '@prisma/client';
import { prisma } from 'src/main';

@Injectable()
export class TransactionService {

    fetchAllUsersTransactions() {
        return prisma.transactions.findMany({
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
        return prisma.transactions.findMany({
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
        return prisma.transactions.findMany({
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
        return prisma.transactions.create({
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
