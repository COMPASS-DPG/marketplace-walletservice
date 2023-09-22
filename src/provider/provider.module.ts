import { Module } from '@nestjs/common';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { TransactionService } from 'src/transactions/transactions.service';
import { WalletService } from 'src/wallet/wallet.service';

@Module({
  controllers: [ProviderController],
  providers: [ProviderService, TransactionService, WalletService]
})
export class ProviderModule {}
