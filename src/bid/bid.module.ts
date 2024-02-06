import { Module } from '@nestjs/common';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidEntity } from './bid.entity';
import { AuctionModule } from 'src/auction/auction.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([BidEntity]), AuctionModule, UserModule],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}
