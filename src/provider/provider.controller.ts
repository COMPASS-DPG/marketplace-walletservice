import { Body, Controller, Get, HttpStatus, Logger, Param, ParseUUIDPipe, Post, Res } from '@nestjs/common';
import { TransactionService } from 'src/transactions/transactions.service';
import { ProviderService } from './provider.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transaction } from 'src/transactions/dto/transactions.dto';
import { AdminService } from 'src/admin/admin.service';
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

}
