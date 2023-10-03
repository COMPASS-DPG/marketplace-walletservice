import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { TransactionService } from 'src/transactions/transactions.service';
import { WalletService } from 'src/wallet/wallet.service';
import { ProviderService } from 'src/provider/provider.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConsumerController],
  providers: [ConsumerService, TransactionService, WalletService, ProviderService]
})
export class ConsumerModule {}
