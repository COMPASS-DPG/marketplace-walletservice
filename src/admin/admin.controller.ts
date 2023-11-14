import { Body, Controller, Get, HttpStatus, Logger, Param, ParseUUIDPipe, Post, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { TransactionService } from 'src/transactions/transactions.service';
import { ConsumerService } from 'src/consumer/consumer.service';
import { TransactionType } from '@prisma/client';
import { ProviderService } from 'src/provider/provider.service';
import { CreditsDto } from '../dto/credits.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transaction } from 'src/transactions/dto/transactions.dto';
import { WalletCredits } from 'src/wallet/dto/wallet.dto';
import { getPrismaErrorStatusAndMessage } from 'src/utils/utils';


@ApiTags('admin')
@Controller('admin')
export class AdminController {

    private readonly logger = new Logger(AdminController.name);

    constructor(
        private transactionService: TransactionService,
        private consumerService: ConsumerService,
        private adminService: AdminService,
        private providerService: ProviderService
    ) {}

    @ApiOperation({ summary: 'Get All Consumers Transactions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: [Transaction] })
    @Get("/:adminId/transactions/consumers")
    // get all transactions of all consumers
    async getAllConsumersTransactions(
        @Param("adminId", ParseUUIDPipe) adminId: string,
        @Res() res
    ) {
        try {
            this.logger.log(`Validating admin`);
            
            // check admin
            await this.adminService.getAdminWallet(adminId);
            
            this.logger.log(`Getting all consumer transactions`);

            // fetch transactions
            const transactions = await this.transactionService.fetchAllConsumersTransactions();

            this.logger.log(`Successfully retrieved all the transactions`);

            return res.status(HttpStatus.OK).json({
                message: "transactions fetched successfully",
                data: {
                    transactions
                }
            });
        } catch (err) {
            this.logger.error(`Failed to retreive all the transactions`);

            const {errorMessage, statusCode} = getPrismaErrorStatusAndMessage(err);
            res.status(statusCode).json({
                statusCode, 
                message: errorMessage || "Failed to fetch all the transactions",
            });
        }
    }

    @ApiOperation({ summary: 'Get One Consumer Transactions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: [Transaction] })
    @Get("/:adminId/transactions/consumers/:consumerId")
    // get all transactions of a particular consumer
    async getConsumerTransactions(
        @Param("adminId", ParseUUIDPipe) adminId: string,
        @Param("consumerId", ParseUUIDPipe) consumerId: string,
        @Res() res
    ) {
        try {
            this.logger.log(`Validating admin`);

            // check admin
            await this.adminService.getAdminWallet(adminId);

            this.logger.log(`Validating Consumer`);

            // check consumer
            await this.consumerService.getConsumerWallet(consumerId);

            this.logger.log(`Getting the consumer transactions`);

            // fetch transactions
            const transactions = await this.transactionService.fetchTransactionsOfOneUser(consumerId);

            this.logger.log(`Successfully retrieved all the transactions`);

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

    @ApiOperation({ summary: 'Get All Admin Providers Transactions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: [Transaction] })
    @Get("/:adminId/transactions/providers")
    // get all transactions between all providers and admins
    async getAllAdminProvidersTransactions(
        @Param("adminId", ParseUUIDPipe) adminId: string,
        @Res() res
    ) {
        try {
            this.logger.log(`Validating admin`);

            // check admin
            await this.adminService.getAdminWallet(adminId);
            
            this.logger.log(`Getting all providers transactions`);

            // fetch transactions
            const transactions = await this.transactionService.fetchAllAdminProviderTransactions();

            this.logger.log(`Successfully retrieved all the transactions`);
            
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

    @ApiOperation({ summary: 'Get One Provider Transactions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: [Transaction] })
    @Get("/:adminId/transactions/providers/:providerId")
    // get all transactions of a particular provider
    async getProviderTransactions(
        @Param("adminId", ParseUUIDPipe) adminId: string,
        @Param("providerId", ParseUUIDPipe) providerId: string,
        @Res() res
    ) {
        try {
            this.logger.log(`Validating admin`);

            // check admin
            await this.adminService.getAdminWallet(adminId);

            this.logger.log(`Validating Provider`);

            // check provider
            await this.providerService.getProviderWallet(providerId);

            this.logger.log(`Getting the providers transactions`);
            
            // fetch transactions
            const transactions = await this.transactionService.fetchTransactionsOfOneUser(providerId);

            this.logger.log(`Successfully retrieved all the transactions`);

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

    @ApiOperation({ summary: 'Add Credits' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Credits added successfully', type: WalletCredits })
    @Post("/:adminId/add-credits")
    // add credits to a consumer's wallet
    async addCredits(
        @Param("adminId", ParseUUIDPipe) adminId: string,
        @Body() creditsDto: CreditsDto,
        @Res() res
    ) { 
        try {
            this.logger.log(`Validating admin`);

            // check admin
            const adminWallet = await this.adminService.getAdminWallet(adminId);

            this.logger.log(`Updating Consumer wallet`);

            // update wallet
            const consumerWallet = await this.consumerService.addCreditsToConsumer(creditsDto.consumerId, creditsDto.credits);
            
            this.logger.log(`Creating transaction`);

            // create transaction
            await this.transactionService.createTransaction(creditsDto.credits, adminWallet.walletId, consumerWallet.walletId, TransactionType.CREDIT_REQUEST);

            this.logger.log(`Successfully added credits`);

            return res.status(HttpStatus.OK).json({
                message: "Credits added successfully",
                data: {
                    credits: consumerWallet.credits
                }
            });
        } catch (err) {
            this.logger.error(`Failed to add credits`);

            const {errorMessage, statusCode} = getPrismaErrorStatusAndMessage(err);
            res.status(statusCode).json({
                statusCode, 
                message: errorMessage || "Failed to add credits",
            });
        } 
    }

    @ApiOperation({ summary: 'Reduce Credits' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Credits added successfully', type: WalletCredits })
    @Post("/:adminId/reduce-credits")
    // reduce credits from a consumer's wallet
    async reduceCredits(
        @Param("adminId", ParseUUIDPipe) adminId: string,
        @Body() creditsDto: CreditsDto,
        @Res() res
    ) {
        try {
            this.logger.log(`Validating admin`);

            // check admin
            const adminWallet = await this.adminService.getAdminWallet(adminId);

            this.logger.log(`Updating Consumer wallet`);

            // update wallet
            const consumerWallet = await this.consumerService.reduceConsumerCredits(creditsDto.consumerId, creditsDto.credits);

            this.logger.log(`Creating transaction`);

            // create transaction
            await this.transactionService.createTransaction(creditsDto.credits, consumerWallet.walletId, adminWallet.walletId, TransactionType.CREDIT_REQUEST);
            
            this.logger.log(`Successfully reduced credits`);

            return res.status(HttpStatus.OK).json({
                message: "Credits reduced successfully",
                data: {
                    credits: consumerWallet.credits
                }
            })
        } catch (err) {
            this.logger.error(`Failed to reduce credits`);

            const {errorMessage, statusCode} = getPrismaErrorStatusAndMessage(err);
            res.status(statusCode).json({
                statusCode, 
                message: errorMessage || "Failed to reduce credits",
            });
        } 
    }
}
