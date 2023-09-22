import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { TransactionService } from 'src/transactions/transactions.service';
import { UserService } from 'src/user/user.service';
import { TransactionType } from '@prisma/client';
import { ProviderService } from 'src/provider/provider.service';
import { CreditsDto } from './dto/credits.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transaction } from 'src/transactions/dto/transactions.dto';
import { WalletCredits } from 'src/wallet/dto/wallet.dto';


@ApiTags('admin')
@Controller('admin')
export class AdminController {
    constructor(
        private transactionService: TransactionService,
        private userService: UserService,
        private adminService: AdminService,
        private providerService: ProviderService
    ) {}

    @ApiOperation({ summary: 'Get All Users Transactions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: [Transaction] })
    @Get("/:adminId/transactions/users")
    // get all transactions of all users
    async getAllUsersTransactions(
        @Param("adminId", ParseIntPipe) adminId: number
    ) {
        // check admin
        await this.adminService.getAdminWallet(adminId);
        
        // fetch transactions
        const transactions = await this.transactionService.fetchAllUsersTransactions();
        return {
            statusCode: HttpStatus.OK,
            message: "transactions fetched successfully",
            body: {
                transactions
            }
        }
    }

    @ApiOperation({ summary: 'Get One User Transactions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: [Transaction] })
    @Get("/:adminId/transactions/users/:userId")
    // get all transactions of a particular user
    async getUserTransactions(
        @Param("adminId", ParseIntPipe) adminId: number,
        @Param("userId", ParseIntPipe) userId: number
    ) {
        // check admin
        await this.adminService.getAdminWallet(adminId);

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

    @ApiOperation({ summary: 'Get All Admin Providers Transactions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: [Transaction] })
    @Get("/:adminId/transactions/providers")
    // get all transactions between all providers and admins
    async getAllAdminProvidersTransactions(
        @Param("adminId", ParseIntPipe) adminId: number
    ) {
        // check admin
        await this.adminService.getAdminWallet(adminId);
        
        // fetch transactions
        const transactions = await this.transactionService.fetchAllAdminProviderTransactions();
        return {
            statusCode: HttpStatus.OK,
            message: "transactions fetched successfully",
            body: {
                transactions
            }
        }
    }

    @ApiOperation({ summary: 'Get One Provider Transactions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: [Transaction] })
    @Get("/:adminId/transactions/providers/:providerId")
    // get all transactions of a particular provider
    async getProviderTransactions(
        @Param("adminId", ParseIntPipe) adminId: number,
        @Param("providerId", ParseIntPipe) providerId: number
    ) {
        // check admin
        await this.adminService.getAdminWallet(adminId);

        // check provider
        await this.providerService.getProviderWallet(providerId);
        
        // fetch transactions
        const transactions = await this.transactionService.fetchTransactionsOfOneSystemActor(providerId);
        return {
            statusCode: HttpStatus.OK,
            message: "transactions fetched successfully",
            body: {
                transactions
            }
        }
    }

    @ApiOperation({ summary: 'Add Credits' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Credits added successfully', type: WalletCredits })
    @Post("/:adminId/add-credits")
    // add credits to a user's wallet
    async addCredits(
        @Param("adminId", ParseIntPipe) adminId: number,
        @Body() creditsDto: CreditsDto
    ) { 
        // check admin
        const adminWallet = await this.adminService.getAdminWallet(adminId);

        // update wallet
        const userWallet = await this.userService.addCreditsToUser(creditsDto.userId, creditsDto.credits);
        
        // create transaction
        await this.transactionService.createTransaction(creditsDto.credits, adminWallet.walletId, userWallet.walletId, TransactionType.creditRequest);

        return {
            statusCode: HttpStatus.OK,
            message: "Credits added successfully",
            body: {
                credits: userWallet.credits
            }
        }
    }

    @ApiOperation({ summary: 'Reduce Credits' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Credits added successfully', type: WalletCredits })
    @Post("/:adminId/reduce-credits")
    // reduce credits from a user's wallet
    async reduceCredits(
        @Param("adminId", ParseIntPipe) adminId: number,
        @Body() creditsDto: CreditsDto
    ) {
        // check admin
        const adminWallet = await this.adminService.getAdminWallet(adminId);

        // update wallet
        const userWallet = await this.userService.reduceUserCredits(creditsDto.userId, creditsDto.credits);

        // create transaction
        await this.transactionService.createTransaction(creditsDto.credits, userWallet.walletId, adminWallet.walletId, TransactionType.creditRequest);
        
        return {
            statusCode: HttpStatus.OK,
            message: "Credits reduced successfully",
            body: {
                credits: userWallet.credits
            }
        }
    }
}
