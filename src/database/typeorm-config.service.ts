import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import 'dotenv/config';
import { AuctionEntity } from 'src/auction/auction.entity';
import { BidEntity } from 'src/bid/bid.entity';
import { TagEntity } from 'src/tag/tag.entity';
import { UserEntity } from 'src/user/user.entity';
import { UserCreditEntity } from 'src/user-credit/user-credit.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        UserEntity,
        AuctionEntity,
        BidEntity,
        TagEntity,
        UserCreditEntity,
      ],
      synchronize: true,
      logging: true,
    };
  }
}
