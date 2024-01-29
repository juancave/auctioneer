import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { BidModule } from './bid/bid.module';
import { AuctionModule } from './auction/auction.module';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';

@Module({
  imports: [UserModule, BidModule, AuctionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
