import { Module } from '@nestjs/common';
import { EnduserController } from './enduser.controller';
import { EnduserService } from './enduser.service';
import { TransactionService } from 'src/transactions/transactions.service';
import { WalletService } from 'src/wallet/wallet.service';
import { ProviderService } from 'src/provider/provider.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EnduserController],
  providers: [EnduserService, TransactionService, WalletService, ProviderService]
})
export class EnduserModule {}
