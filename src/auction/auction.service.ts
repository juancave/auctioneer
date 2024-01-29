import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { AuctionDto } from './auction.dto';
import { ALREADY_EXISTS, MISSING_FIELDS } from 'src/shared/constants';

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

  create(auctionDto: AuctionDto): AuctionDto {
    if (
      !auctionDto.description ||
      !auctionDto.increments ||
      !auctionDto.startsOn ||
      !auctionDto.value ||
      !auctionDto.state
    ) {
      throw new BadRequestException(MISSING_FIELDS);
    }

    const auctionExists = data.some(
      ({ description }) => description === auctionDto.description,
    );
    if (auctionExists) {
      throw new ConflictException(ALREADY_EXISTS);
    }

    const createdAuction = {
      id: data[data.length - 1].id + 1,
      date: new Date(),
      ...auctionDto,
    };

    data.push(createdAuction);

    return createdAuction;
  }
}
