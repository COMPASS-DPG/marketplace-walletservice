import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TransactionService } from 'src/transactions/transactions.service';
import { WalletService } from 'src/wallet/wallet.service';
import { ProviderService } from 'src/provider/provider.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, TransactionService, WalletService, ProviderService]
})
export class UserModule {}
