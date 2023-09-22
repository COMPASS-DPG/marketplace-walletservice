import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { TransactionService } from 'src/transactions/transactions.service';
import { UserService } from './user.service';
import { ProviderService } from 'src/provider/provider.service';
import { PurchaseDto } from './dto/purchase.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WalletCredits } from 'src/wallet/dto/wallet.dto';
import { Transaction } from 'src/transactions/dto/transactions.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(
        private transactionService: TransactionService,
        private userService: UserService,
        private providerService: ProviderService
    ) {}

    @ApiOperation({ summary: 'Get User Credits' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Credits fetched successfully', type: WalletCredits })
    @Get("/:userId/credits")
    // get credits of a particular user
    async getCredits(
        @Param("userId", ParseIntPipe) userId: number
    ) {
        // fetch wallet
        const wallet = await this.userService.getUserWallet(userId);

        return {
            statusCode: HttpStatus.OK,
            message: "Credits fetched successfully",
            body: {
                credits: wallet.credits
            }
        }
    }

    @ApiOperation({ summary: 'Get User Transactions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: [Transaction] })
    @Get("/:userId/transactions")
    // get all transactions of a particular user
    async getUserTransactions(
        @Param("userId", ParseIntPipe) userId: number
    ) {
        // check user
        await this.userService.getUserWallet(userId);

        // fetch transactions
        const transactions = await this.transactionService.fetchTransactionsOfOneSystemActor(userId);
        return {
            statusCode: HttpStatus.OK,
            message: "transactions fetched successfully",
            body: {
                transactions
            }
        }
    }

    @ApiOperation({ summary: 'Handle Purchase' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: Transaction })
    @Post("/:userId/purchase")
    // decrease credits from a user's wallet due to purchase
    async handlePurchase(
        @Param("userId", ParseIntPipe) userId: number,
        @Body() purchaseDto: PurchaseDto
    ) {        
        // update user wallet
        const userWalletPromise = this.userService.reduceUserCredits(userId, purchaseDto.credits);

        // update provider wallet
        const providerWalletPromise = this.providerService.addCreditsToProvider(purchaseDto.providerId, purchaseDto.credits);

        const [userWallet, providerWallet] = await Promise.all([userWalletPromise, providerWalletPromise]);

        // create transaction
        const transaction = await this.transactionService.createTransaction(purchaseDto.credits, userWallet.walletId, providerWallet.walletId, TransactionType.purchase);

        return {
            statusCode: HttpStatus.OK,
            message: "purchase successful",
            body: {
                transaction
            }
        }
    }
}
