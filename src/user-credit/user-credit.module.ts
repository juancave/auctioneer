import { Module } from '@nestjs/common';
import { UserCreditController } from './user-credit.controller';
import { UserCreditService } from './user-credit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCreditEntity } from './user-credit.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserCreditEntity]), UserModule],
  controllers: [UserCreditController],
  providers: [UserCreditService],
  exports: [UserCreditService],
})
export class UserCreditModule {}
