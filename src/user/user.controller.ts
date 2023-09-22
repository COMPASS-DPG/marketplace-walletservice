import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, UnauthorizedException } from '@nestjs/common';
import { TransactionType, WalletType } from '@prisma/client';
import { TransactionService } from 'src/transactions/transactions.service';
import { UserService } from './user.service';
import { ProviderService } from 'src/provider/provider.service';

@Controller('users')
export class UserController {
    constructor(
        private transactionService: TransactionService,
        private userService: UserService,
        private providerService: ProviderService
    ) {}

    @Get("/:userId/credits")
    // get credits of a particular user
    async getCredits(
        @Param("userId", ParseIntPipe) userId: number,
    ) {
        // fetch wallet
        const wallet = await this.userService.getUserWallet(userId);

        return wallet.credits;
    }

    @Get("/:userId/transactions")
    // get all transactions of a particular user
    async getUserTransactions(
        @Param("userId", ParseIntPipe) userId: number
    ) {
        // check user
        await this.userService.getUserWallet(userId);

        // fetch transactions
        const transactions = await this.transactionService.fetchTransactionsOfOneSystemActor(userId);
        return transactions;
    }

    @Post("/:userId/purchase")
    // decrease credits from a user's wallet due to purchase
    async handlePurchase(
        @Param("userId", ParseIntPipe) userId: number,
        @Body("credits") credits: number,
        @Body("providerId") providerId: number
    ) {        
        // update user wallet
        const userWalletPromise = this.userService.reduceUserCredits(userId, credits);

        // update provider wallet
        const providerWalletPromise = this.providerService.addCreditsToProvider(providerId, credits);

        const [userWallet, providerWallet] = await Promise.all([userWalletPromise, providerWalletPromise]);

        // create transaction
        const transaction = await this.transactionService.createTransaction(credits, userWallet.walletId, providerWallet.walletId, TransactionType.purchase);

        return transaction.transactionId;
    }
}
