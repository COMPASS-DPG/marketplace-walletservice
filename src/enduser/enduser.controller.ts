import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { TransactionService } from 'src/transactions/transactions.service';
import { EnduserService } from './enduser.service';
import { ProviderService } from 'src/provider/provider.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WalletCredits } from 'src/wallet/dto/wallet.dto';
import { Transaction } from 'src/transactions/dto/transactions.dto';
import { PurchaseDto } from 'src/dto/credits.dto';

@ApiTags('endusers')
@Controller('endusers')
export class EnduserController {
    constructor(
        private transactionService: TransactionService,
        private enduserService: EnduserService,
        private providerService: ProviderService
    ) {}

    @ApiOperation({ summary: 'Get Enduser Credits' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Credits fetched successfully', type: WalletCredits })
    @Get("/:enduserId/credits")
    // get credits of a particular enduser
    async getCredits(
        @Param("enduserId", ParseIntPipe) enduserId: number,
        @Res() res
    ) {
        // fetch wallet
        const wallet = await this.enduserService.getEnduserWallet(enduserId);

        return res.status(HttpStatus.OK).json({
            message: "Credits fetched successfully",
            data: {
                credits: wallet.credits
            }
        })
    }

    @ApiOperation({ summary: 'Get Enduser Transactions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: [Transaction] })
    @Get("/:enduserId/transactions")
    // get all transactions of a particular enduser
    async getEnduserTransactions(
        @Param("enduserId", ParseIntPipe) enduserId: number,
        @Res() res
    ) {
        // check enduser
        await this.enduserService.getEnduserWallet(enduserId);

        // fetch transactions
        const transactions = await this.transactionService.fetchTransactionsOfOneUser(enduserId);
        return res.status(HttpStatus.OK).json({
            message: "transactions fetched successfully",
            data: {
                transactions
            }
        })
    }

    @ApiOperation({ summary: 'Handle Purchase' })
    @ApiResponse({ status: HttpStatus.OK, description: 'purchase successful', type: Transaction })
    @Post("/:enduserId/purchase")
    // transfer credits from  endenduser's wallet to provider wallet for purchase
    async handlePurchase(
        @Param("enduserId", ParseIntPipe) enduserId: number,
        @Body() purchaseDto: PurchaseDto,
        @Res() res
    ) {        
        // update enduser wallet
        const enduserWalletPromise = this.enduserService.reduceEnduserCredits(enduserId, purchaseDto.credits);

        // update provider wallet
        const providerWalletPromise = this.providerService.addCreditsToProvider(purchaseDto.providerId, purchaseDto.credits);

        const [enduserWallet, providerWallet] = await Promise.all([enduserWalletPromise, providerWalletPromise]);

        // create transaction
        const transaction = await this.transactionService.createTransaction(purchaseDto.credits, enduserWallet.walletId, providerWallet.walletId, TransactionType.purchase);

        return res.status(HttpStatus.OK).json({
            message: "purchase successful",
            data: {
                transaction
            }
        })
    }
}
