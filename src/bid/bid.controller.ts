import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidDto } from './bid.dto';

@Controller('bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Get('/:auctionId')
  getByAuctionId(@Param('auctionId') auctionId: number): BidDto[] {
    return this.bidService.getByAuctionId(Number(auctionId));
  }

  @Get('/:auctionId/:userId')
  getByUserId(
    @Param('auctionId') auctionId: number,
    @Param('userId') userId: number,
  ): BidDto[] {
    return this.bidService.getByUserId(Number(auctionId), Number(userId));
  }

  @Post()
  create(@Body() bidDto: BidDto): BidDto {
    return this.bidService.create(bidDto);
  }
}
