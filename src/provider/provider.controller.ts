import { Body, Controller, Get, HttpStatus, Logger, Param, ParseUUIDPipe, Post, Res } from '@nestjs/common';
import { TransactionService } from 'src/transactions/transactions.service';
import { ProviderService } from './provider.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transaction } from 'src/transactions/dto/transactions.dto';
import { SettlementDto } from 'src/dto/credits.dto';
import { AdminService } from 'src/admin/admin.service';
import { TransactionType } from '@prisma/client';
import { WalletCredits } from 'src/wallet/dto/wallet.dto';
import { getPrismaErrorStatusAndMessage } from 'src/utils/utils';

@ApiTags('providers')
@Controller('providers')
export class ProviderController {

    private readonly logger = new Logger(ProviderController.name);

    constructor(
        private transactionService: TransactionService,
        private providerService: ProviderService,
        private adminService: AdminService
    ) {}
    
    @ApiOperation({ summary: 'Get Provider Credits' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Credits fetched successfully', type: WalletCredits })
    @Get("/:providerId/credits")
    async getCredits(
        @Param("providerId", ParseUUIDPipe) providerId: string,
        @Res() res
    ) {
        try {
            this.logger.log(`Getting provider wallet`);

            // fetch wallet
            const wallet = await this.providerService.getProviderWallet(providerId);

            this.logger.log(`Successfully retrieved the credits`);

            return res.status(HttpStatus.OK).json({
                message: "Credits fetched successfully",
                data: {
                    credits: wallet.credits
                }
            })
        } catch (err) {
            this.logger.error(`Failed to retreive the credits`);

            const {errorMessage, statusCode} = getPrismaErrorStatusAndMessage(err);
            res.status(statusCode).json({
                statusCode, 
                message: errorMessage || "Failed to retreive the credits",
            });
        }
    }

    @ApiOperation({ summary: 'Get Provider Transactions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: [Transaction] })
    @Get("/:providerId/transactions")
    // get all transactions of a particular provider
    async getProviderTransactions(
        @Param("providerId", ParseUUIDPipe) providerId: string,
        @Res() res
    ) {
        try {
            this.logger.log(`Validating provider`);
            
            // check provider
            await this.providerService.getProviderWallet(providerId);

            this.logger.log(`Getting all provider's transactions`);

            // fetch transactions
            const transactions = await this.transactionService.fetchTransactionsOfOneUser(providerId);
            return res.status(HttpStatus.OK).json({
                message: "transactions fetched successfully",
                data: {
                    transactions
                }
            })
        } catch (err) {
            this.logger.error(`Failed to retreive the transactions`);

            const {errorMessage, statusCode} = getPrismaErrorStatusAndMessage(err);
            res.status(statusCode).json({
                statusCode, 
                message: errorMessage || "Failed to retreive the transactions",
            });
        }
    }

    @ApiOperation({ summary: 'Transfer settlement credits and record transaction' })
    @ApiResponse({ status: HttpStatus.OK, description: 'credits transferred successfully', type: Transaction })
    @Post("/:providerId/settlement-transaction")
    // Transfer credits from provider wallet to admin wallet 
    async settleProviderWallet(
        @Param("providerId", ParseUUIDPipe) providerId: string,
        @Body() settlementDto: SettlementDto,
        @Res() res
    ) {
        try {
            this.logger.log(`Updating provider wallet`);

            // update provider wallet
            const providerWalletPromise = this.providerService.reduceProviderCredits(providerId, settlementDto.credits);

            this.logger.log(`Updating admin wallet`);

            // update admin wallet
            const adminWalletPromise = this.adminService.addCreditsToAdmin(settlementDto.adminId, settlementDto.credits);

            const [providerWallet, adminWallet] = await Promise.all([providerWalletPromise, adminWalletPromise]);

            this.logger.log(`Creating transaction`);

            // create transaction
            const transaction = 
                await this.transactionService.createTransaction(
                    settlementDto.credits, 
                    providerWallet.walletId, 
                    adminWallet.walletId, 
                    TransactionType.SETTLEMENT
                );

            this.logger.log(`Successfully settled credits`);

            return res.status(HttpStatus.OK).json({
                message: "credits transferred successfully",
                data: {
                    transaction
                }
            })
        } catch (err) {
            this.logger.error(`Failed to settle the credits`);

            const {errorMessage, statusCode} = getPrismaErrorStatusAndMessage(err);
            res.status(statusCode).json({
                statusCode, 
                message: errorMessage || "Failed to settle the credits",
            });
        }
    }
}
