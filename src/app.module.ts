import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { ProviderModule } from './provider/provider.module';
import { ConsumerModule } from './consumer/consumer.module';
import { PrismaModule } from './prisma/prisma.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [AdminModule, ProviderModule, ConsumerModule, PrismaModule, WalletModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
