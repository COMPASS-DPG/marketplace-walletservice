import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TransactionService } from 'src/transactions/transactions.service';
import { WalletService } from 'src/wallet/wallet.service';
import { UserService } from 'src/user/user.service';
import { ProviderService } from 'src/provider/provider.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, TransactionService, WalletService, UserService, ProviderService]
})
export class AdminModule {}
