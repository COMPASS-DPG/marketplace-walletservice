import { Body, Controller, Get, HttpStatus, Logger, Param, ParseUUIDPipe, Post, Res } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { TransactionService } from 'src/transactions/transactions.service';
import { ConsumerService } from './consumer.service';
import { ProviderService } from 'src/provider/provider.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WalletCredits } from 'src/wallet/dto/wallet.dto';
import { Transaction } from 'src/transactions/dto/transactions.dto';
import { PurchaseDto } from 'src/dto/credits.dto';
import { getPrismaErrorStatusAndMessage } from 'src/utils/utils';

@ApiTags('consumers')
@Controller('consumers')
export class ConsumerController {

    private readonly logger = new Logger(ConsumerController.name);

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
        @Param("consumerId", ParseUUIDPipe) consumerId: string,
        @Res() res
    ) {
        try {
            this.logger.log(`Getting consumer wallet`);

            // fetch wallet
            const wallet = await this.consumerService.getConsumerWallet(consumerId);
            
            this.logger.log(`Successfully retrieved the credits`);

            return res.status(HttpStatus.OK).json({
                message: "Credits fetched successfully",
                data: {
                    credits: wallet.credits
                }
            });
        } catch (err) {
            this.logger.error(`Failed to retreive the credits`);

            const {errorMessage, statusCode} = getPrismaErrorStatusAndMessage(err);
            res.status(statusCode).json({
                statusCode, 
                message: errorMessage || "Failed to fetch the credits",
            });
        }
    }

    @ApiOperation({ summary: 'Get Consumer Transactions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: [Transaction] })
    @Get("/:consumerId/transactions")
    // get all transactions of a particular consumer
    async getConsumerTransactions(
        @Param("consumerId", ParseUUIDPipe) consumerId: string,
        @Res() res
    ) {
        try {
            this.logger.log(`Validating consumer`);

            // check consumer
            await this.consumerService.getConsumerWallet(consumerId);

            this.logger.log(`Getting consumer transactions`);

            // fetch transactions
            const transactions = await this.transactionService.fetchTransactionsOfOneUser(consumerId);

            this.logger.log(`Successfully retrieved the consumer transactions`);

            return res.status(HttpStatus.OK).json({
                message: "transactions fetched successfully",
                data: {
                    transactions
                }
            });
        } catch (err) {
            this.logger.error(`Failed to retreive the transactions`);

            const {errorMessage, statusCode} = getPrismaErrorStatusAndMessage(err);
            res.status(statusCode).json({
                statusCode, 
                message: errorMessage || "Failed to fetch the transactions",
            });
        }
    }

    @ApiOperation({ summary: 'Handle Purchase' })
    @ApiResponse({ status: HttpStatus.OK, description: 'purchase successful', type: Transaction })
    @Post("/:consumerId/purchase")
    // transfer credits from consumer's wallet to provider wallet for purchase
    async handlePurchase(
        @Param("consumerId", ParseUUIDPipe) consumerId: string,
        @Body() purchaseDto: PurchaseDto,
        @Res() res
    ) {        
        try {
            this.logger.log(`Getting consumer wallet`);

            // fetch consumer wallet
            let consumerWallet = await this.consumerService.getConsumerWallet(consumerId);

            this.logger.log(`Validating provider`);

            // check provider
            let providerWallet = await this.providerService.getProviderWallet(purchaseDto.providerId)

            this.logger.log(`Updating consumer wallet`);

            // update consumer wallet
            const consumerWalletPromise = this.consumerService.reduceConsumerCredits(consumerId, purchaseDto.credits, consumerWallet);

            this.logger.log(`Updating provider wallet`);

            // update provider wallet
            const providerWalletPromise = this.providerService.addCreditsToProvider(purchaseDto.providerId, purchaseDto.credits, providerWallet);

            [consumerWallet, providerWallet] = await Promise.all([consumerWalletPromise, providerWalletPromise]);

            this.logger.log(`Creating transaction`);

            // create transaction
            const transaction = await this.transactionService.createTransaction(purchaseDto.credits, consumerWallet.walletId, providerWallet.walletId, TransactionType.PURCHASE);

            this.logger.log(`Successfully handled purchase`);

            return res.status(HttpStatus.OK).json({
                message: "purchase successful",
                data: {
                    transaction
                }
            });
        } catch (err) {
            this.logger.error(`Failed to handle purchase`);

            const {errorMessage, statusCode} = getPrismaErrorStatusAndMessage(err);
            res.status(statusCode).json({
                statusCode, 
                message: errorMessage || "Failed to handle purchase",
            });
        }
    }
}
