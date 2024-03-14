import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { BidModule } from './bid/bid.module';
import { AuctionModule } from './auction/auction.module';
import { TagModule } from './tag/tag.module';
import { UserCreditModule } from './user-credit/user-credit.module';

import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { TypeOrmConfigService } from './database/typeorm-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    UserModule,
    BidModule,
    AuctionModule,
    TagModule,
    UserCreditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
