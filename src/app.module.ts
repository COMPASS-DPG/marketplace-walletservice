import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { ProviderModule } from './provider/provider.module';
import { ConsumerModule } from './consumer/consumer.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AdminModule, ProviderModule, ConsumerModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
