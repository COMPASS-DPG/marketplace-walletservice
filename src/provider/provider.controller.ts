import { Body, Controller, Get, HttpStatus, Param, ParseUUIDPipe, Post, Res } from '@nestjs/common';
import { TransactionService } from 'src/transactions/transactions.service';
import { ProviderService } from './provider.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transaction } from 'src/transactions/dto/transactions.dto';
import { SettlementDto } from 'src/dto/credits.dto';
import { AdminService } from 'src/admin/admin.service';
import { TransactionType } from '@prisma/client';
import { WalletCredits } from 'src/wallet/dto/wallet.dto';

@ApiTags('providers')
@Controller('providers')
export class ProviderController {
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
        // fetch wallet
        const wallet = await this.providerService.getProviderWallet(providerId);

        return res.status(HttpStatus.OK).json({
            message: "Credits fetched successfully",
            data: {
                credits: wallet.credits
            }
        })
    }

    @ApiOperation({ summary: 'Get Provider Transactions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: [Transaction] })
    @Get("/:providerId/transactions")
    // get all transactions of a particular provider
    async getProviderTransactions(
        @Param("providerId", ParseUUIDPipe) providerId: string,
        @Res() res
    ) {
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

    @ApiOperation({ summary: 'Transfer settlement credits and record transaction' })
    @ApiResponse({ status: HttpStatus.OK, description: 'credits transferred successfully', type: Transaction })
    @Post("/:providerId/settlement-transaction")
    // Transfer credits from provider wallet to admin wallet 
    async settleProviderWallet(
        @Param("providerId", ParseUUIDPipe) providerId: string,
        @Body() settlementDto: SettlementDto,
        @Res() res
    ) {
        // update provider wallet
        const providerWalletPromise = this.providerService.reduceProviderCredits(providerId, settlementDto.credits);

        // update admin wallet
        const adminWalletPromise = this.adminService.addCreditsToAdmin(settlementDto.adminId, settlementDto.credits);

        const [providerWallet, adminWallet] = await Promise.all([providerWalletPromise, adminWalletPromise]);

        // create transaction
        const transaction = await this.transactionService.createTransaction(settlementDto.credits, providerWallet.walletId, adminWallet.walletId, TransactionType.settlement);

        return res.status(HttpStatus.OK).json({
            message: "credits transferred successfully",
            data: {
                transaction
            }
        })
    }
}
