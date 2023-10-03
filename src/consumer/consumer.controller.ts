import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { TransactionService } from 'src/transactions/transactions.service';
import { ConsumerService } from './consumer.service';
import { ProviderService } from 'src/provider/provider.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WalletCredits } from 'src/wallet/dto/wallet.dto';
import { Transaction } from 'src/transactions/dto/transactions.dto';
import { PurchaseDto } from 'src/dto/credits.dto';

@ApiTags('consumers')
@Controller('consumers')
export class ConsumerController {
    constructor(
        private transactionService: TransactionService,
        private consumerService: ConsumerService,
        private providerService: ProviderService
    ) {}

    @ApiOperation({ summary: 'Get Consumer Credits' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Credits fetched successfully', type: WalletCredits })
    @Get("/:consumerId/credits")
    // get credits of a particular consumer
    async getCredits(
        @Param("consumerId", ParseIntPipe) consumerId: number,
        @Res() res
    ) {
        // fetch wallet
        const wallet = await this.consumerService.getConsumerWallet(consumerId);

        return res.status(HttpStatus.OK).json({
            message: "Credits fetched successfully",
            data: {
                credits: wallet.credits
            }
        })
    }

    @ApiOperation({ summary: 'Get Consumer Transactions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: [Transaction] })
    @Get("/:consumerId/transactions")
    // get all transactions of a particular consumer
    async getConsumerTransactions(
        @Param("consumerId", ParseIntPipe) consumerId: number,
        @Res() res
    ) {
        // check consumer
        await this.consumerService.getConsumerWallet(consumerId);

        // fetch transactions
        const transactions = await this.transactionService.fetchTransactionsOfOneUser(consumerId);
        return res.status(HttpStatus.OK).json({
            message: "transactions fetched successfully",
            data: {
                transactions
            }
        })
    }

    @ApiOperation({ summary: 'Handle Purchase' })
    @ApiResponse({ status: HttpStatus.OK, description: 'purchase successful', type: Transaction })
    @Post("/:consumerId/purchase")
    // transfer credits from  endconsumer's wallet to provider wallet for purchase
    async handlePurchase(
        @Param("consumerId", ParseIntPipe) consumerId: number,
        @Body() purchaseDto: PurchaseDto,
        @Res() res
    ) {        
        // update consumer wallet
        const consumerWalletPromise = this.consumerService.reduceConsumerCredits(consumerId, purchaseDto.credits);

        // update provider wallet
        const providerWalletPromise = this.providerService.addCreditsToProvider(purchaseDto.providerId, purchaseDto.credits);

        const [consumerWallet, providerWallet] = await Promise.all([consumerWalletPromise, providerWalletPromise]);

        // create transaction
        const transaction = await this.transactionService.createTransaction(purchaseDto.credits, consumerWallet.walletId, providerWallet.walletId, TransactionType.purchase);

        return res.status(HttpStatus.OK).json({
            message: "purchase successful",
            data: {
                transaction
            }
        })
    }
}