import { Controller, Get, Param } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidDto } from './bid.dto';

@Controller('bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Get('/:auctionId')
  getByAuctionId(@Param('auctionId') auctionId: number): BidDto[] {
    return this.bidService.getByAuctionId(auctionId);
  }

  @Get('/:auctionId/:userId')
  getByUserId(
    @Param('auctionId') auctionId: number,
    @Param('userId') userId: number,
  ): BidDto[] {
    return this.bidService.getByUserId(auctionId, userId);
  }
}
