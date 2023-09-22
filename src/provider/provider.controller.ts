import { Controller, Get, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { TransactionService } from 'src/transactions/transactions.service';
import { ProviderService } from './provider.service';

@Controller('providers')
export class ProviderController {
    constructor(
        private transactionService: TransactionService,
        private providerService: ProviderService
    ) {}

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
