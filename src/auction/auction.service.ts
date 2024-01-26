import { Injectable } from '@nestjs/common';
import { AuctionDto } from './auction.dto';

const data: AuctionDto[] = [
  {
    id: 1,
    description: 'Lego Car',
    date: new Date(),
    value: 200,
    startsOn: 40,
    increments: 10,
    state: 'used',
  },
  {
    id: 2,
    description: 'Bicycle',
    date: new Date(),
    value: 1200,
    startsOn: 150,
    increments: 20,
    state: 'used',
  },
  {
    id: 3,
    description: 'Desk',
    date: new Date(),
    value: 270,
    startsOn: 35,
    increments: 10,
    state: 'new',
  },
];

@Injectable()
export class AuctionService {
  getAll(): AuctionDto[] {
    return data;
  }

  getById(id: number): AuctionDto {
    return data.find((auction) => auction.id === id);
  }
}
