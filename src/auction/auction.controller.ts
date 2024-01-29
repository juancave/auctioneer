import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Post()
  create(@Body() auctionDto: AuctionDto): AuctionDto {
    return this.auctionService.create(auctionDto);
  }
}
