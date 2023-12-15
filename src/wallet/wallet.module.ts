import { Module } from '@nestjs/common';
import { WalletService } from 'src/wallet/wallet.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WalletController } from './wallet.controller';

@Module({
  imports: [PrismaModule],
  controllers: [WalletController],
  providers: [WalletService]
})
export class WalletModule {}
