import { Module } from '@nestjs/common';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidEntity } from './bid.entity';
import { AuctionModule } from 'src/auction/auction.module';
import { UserModule } from 'src/user/user.module';
import { UserCreditModule } from 'src/user-credit/user-credit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BidEntity]),
    AuctionModule,
    UserModule,
    UserCreditModule,
  ],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}
