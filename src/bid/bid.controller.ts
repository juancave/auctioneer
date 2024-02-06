import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { BidService } from './bid.service';
import { BidDto } from './bid.dto';

@Controller('bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Get('/:auctionId')
  getByAuctionId(@Param('auctionId') auctionId: number) {
    return this.bidService.getByAuctionId(Number(auctionId));
  }

  @Get('/:auctionId/:userId')
  getByUserId(
    @Param('auctionId', ParseIntPipe) auctionId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.bidService.getByUserId(auctionId, userId);
  }

  @Post()
  create(@Body() bidDto: BidDto) {
    return this.bidService.create(bidDto);
  }
}
