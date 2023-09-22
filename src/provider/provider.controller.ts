import { Controller, Get, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { TransactionService } from 'src/transactions/transactions.service';
import { ProviderService } from './provider.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transaction } from 'src/transactions/dto/transactions.dto';

@ApiTags('providers')
@Controller('providers')
export class ProviderController {
    constructor(
        private transactionService: TransactionService,
        private providerService: ProviderService
    ) {}
    
    @ApiOperation({ summary: 'Get Provider Transactions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'transactions fetched successfully', type: [Transaction] })
    @Get("/:providerId/transactions")
    // get all transactions of a particular provider
    async getProviderTransactions(
        @Param("providerId", ParseIntPipe) providerId: number,
    ) {
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
}
