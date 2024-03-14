import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserCreditService } from './user-credit.service';
import { UserCreditDto } from './user-credit.dto';

@Controller('user')
export class UserCreditController {
  constructor(private readonly userCreditService: UserCreditService) {}

  @Get('/:userId/credit')
  getCredits(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserCreditDto[]> {
    return this.userCreditService.getCredits(userId);
  }

  @Post('/credit')
  create(@Body() userCreditDto: UserCreditDto): Promise<UserCreditDto> {
    return this.userCreditService.create(userCreditDto);
  }
}
