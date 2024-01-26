import { Controller, Get, Param } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionDto } from './auction.dto';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get()
  getAll(): AuctionDto[] {
    return this.auctionService.getAll();
  }

  @Get('/:id')
  getById(@Param('id') id: number): AuctionDto {
    return this.auctionService.getById(Number(id));
  }
}
