import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TransactionService } from 'src/transactions/transactions.service';
import { WalletService } from 'src/wallet/wallet.service';
import { ConsumerService } from 'src/consumer/consumer.service';
import { ProviderService } from 'src/provider/provider.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminController],
  providers: [AdminService, TransactionService, WalletService, ConsumerService, ProviderService]
})
export class AdminModule {}
