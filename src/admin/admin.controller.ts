import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { TransactionService } from 'src/transactions/transactions.service';
import { ConsumerService } from 'src/consumer/consumer.service';
import { TransactionType } from '@prisma/client';
import { ProviderService } from 'src/provider/provider.service';
import { CreditsDto } from '../dto/credits.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transaction } from 'src/transactions/dto/transactions.dto';
import { WalletCredits } from 'src/wallet/dto/wallet.dto';


@ApiTags('admin')
@Controller('admin')
export class AdminController {
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
        @Param("adminId", ParseIntPipe) adminId: number,
        @Res() res
    ) {
        // check admin
        await this.adminService.getAdminWallet(adminId);
        
        // fetch transactions
        const transactions = await this.transactionService.fetchAllConsumersTransactions();

        return res.status(HttpStatus.OK).json({
            message: "transactions fetched successfully",
            data: {
                transactions
            }
        })
    }

    @ApiOperation({ summary: 'Get One Consumer Transactions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: [Transaction] })
    @Get("/:adminId/transactions/consumers/:consumerId")
    // get all transactions of a particular consumer
    async getConsumerTransactions(
        @Param("adminId", ParseIntPipe) adminId: number,
        @Param("consumerId", ParseIntPipe) consumerId: number,
        @Res() res
    ) {
        // check admin
        await this.adminService.getAdminWallet(adminId);

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

    @ApiOperation({ summary: 'Get All Admin Providers Transactions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: [Transaction] })
    @Get("/:adminId/transactions/providers")
    // get all transactions between all providers and admins
    async getAllAdminProvidersTransactions(
        @Param("adminId", ParseIntPipe) adminId: number,
        @Res() res
    ) {
        // check admin
        await this.adminService.getAdminWallet(adminId);
        
        // fetch transactions
        const transactions = await this.transactionService.fetchAllAdminProviderTransactions();
        return res.status(HttpStatus.OK).json({
            message: "transactions fetched successfully",
            data: {
                transactions
            }
        })
    }

    @ApiOperation({ summary: 'Get One Provider Transactions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: [Transaction] })
    @Get("/:adminId/transactions/providers/:providerId")
    // get all transactions of a particular provider
    async getProviderTransactions(
        @Param("adminId", ParseIntPipe) adminId: number,
        @Param("providerId", ParseIntPipe) providerId: number,
        @Res() res
    ) {
        // check admin
        await this.adminService.getAdminWallet(adminId);

        // check provider
        await this.providerService.getProviderWallet(providerId);
        
        // fetch transactions
        const transactions = await this.transactionService.fetchTransactionsOfOneUser(providerId);
        return res.status(HttpStatus.OK).json({
            message: "transactions fetched successfully",
            data: {
                transactions
            }
        })
    }

    @ApiOperation({ summary: 'Add Credits' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Credits added successfully', type: WalletCredits })
    @Post("/:adminId/add-credits")
    // add credits to a consumer's wallet
    async addCredits(
        @Param("adminId", ParseIntPipe) adminId: number,
        @Body() creditsDto: CreditsDto,
        @Res() res
    ) { 
        // check admin
        const adminWallet = await this.adminService.getAdminWallet(adminId);

        // update wallet
        const consumerWallet = await this.consumerService.addCreditsToConsumer(creditsDto.consumerId, creditsDto.credits);
        
        // create transaction
        await this.transactionService.createTransaction(creditsDto.credits, adminWallet.walletId, consumerWallet.walletId, TransactionType.creditRequest);

        return res.status(HttpStatus.OK).json({
            message: "Credits added successfully",
            data: {
                credits: consumerWallet.credits
            }
        })
    }

    @ApiOperation({ summary: 'Reduce Credits' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Credits added successfully', type: WalletCredits })
    @Post("/:adminId/reduce-credits")
    // reduce credits from a consumer's wallet
    async reduceCredits(
        @Param("adminId", ParseIntPipe) adminId: number,
        @Body() creditsDto: CreditsDto,
        @Res() res
    ) {
        // check admin
        const adminWallet = await this.adminService.getAdminWallet(adminId);

        // update wallet
        const consumerWallet = await this.consumerService.reduceConsumerCredits(creditsDto.consumerId, creditsDto.credits);

        // create transaction
        await this.transactionService.createTransaction(creditsDto.credits, consumerWallet.walletId, adminWallet.walletId, TransactionType.creditRequest);
        
        return res.status(HttpStatus.OK).json({
            message: "Credits reduced successfully",
            data: {
                credits: consumerWallet.credits
            }
        })
    }
}
