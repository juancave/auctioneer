import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionDto } from './auction.dto';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get()
  getAll(): Promise<AuctionDto[]> {
    return this.auctionService.getAll();
  }

  @Get('/:id')
  getById(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<AuctionDto> {
    return this.auctionService.getById(id);
  }

  @Post()
  create(@Body() auctionDto: AuctionDto): Promise<AuctionDto> {
    return this.auctionService.create(auctionDto);
  }
}
