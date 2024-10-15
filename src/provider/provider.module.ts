import { Module } from '@nestjs/common';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { TransactionService } from 'src/transactions/transactions.service';
import { WalletService } from 'src/wallet/wallet.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminService } from 'src/admin/admin.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProviderController],
  providers: [ProviderService, TransactionService, WalletService, AdminService]
})
export class ProviderModule {}
