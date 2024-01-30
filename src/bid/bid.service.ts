import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { BidDto } from './bid.dto';
import { MISSING_FIELDS } from 'src/shared/constants';
import { data as auctionData } from '../auction/auction.service';
import { data as userData } from '../user/user.service';

const data: BidDto[] = [
  { id: 1, auctionId: 1, date: new Date(), value: 40, userId: 1 },
  { id: 2, auctionId: 2, date: new Date(), value: 150, userId: 2 },
  { id: 3, auctionId: 1, date: new Date(), value: 50, userId: 1 },
  { id: 4, auctionId: 3, date: new Date(), value: 35, userId: 2 },
  { id: 5, auctionId: 1, date: new Date(), value: 120, userId: 1 },
];

@Injectable()
export class BidService {
  getByAuctionId(auctionId: number): BidDto[] {
    return data.filter((bid) => bid.auctionId == auctionId);
  }

  getByUserId(auctionId: number, userId: number): BidDto[] {
    return data.filter(
      (bid) => bid.auctionId === auctionId && bid.userId === userId,
    );
  }

  create(bidDto: BidDto): BidDto {
    if (!bidDto.value || !bidDto.auctionId || !bidDto.userId) {
      throw new BadRequestException(MISSING_FIELDS);
    }

    const auction = auctionData.find(({ id }) => id === bidDto.auctionId);
    if (!auction) {
      throw new ConflictException('The auction does not exists');
    }

    const userExists = userData.some(({ id }) => id === bidDto.userId);
    if (!userExists) {
      throw new ConflictException('The user does not exists');
    }

    const currentBids = data.filter(
      ({ auctionId }) => auctionId === bidDto.auctionId,
    );
    if (currentBids.length) {
      const maxValue = Math.max(...currentBids.map(({ value }) => value));
      const minimumBid = maxValue + auction.increments;

      if (auction.value === maxValue) {
        throw new ConflictException('The auction found a buyer');
      }

      if (minimumBid <= auction.value && bidDto.value < minimumBid) {
        throw new ConflictException(
          `The minimum bid for this auction is ${minimumBid}`,
        );
      }
    }

    if (bidDto.value < auction.startsOn) {
      throw new ConflictException(
        `The provided value is less than the minimun bid of ${auction.startsOn}`,
      );
    }

    if (bidDto.value > auction.value) {
      throw new ConflictException(
        `The provided value is highter than the buyout value of ${auction.value}`,
      );
    }

    const createdBid: BidDto = {
      id: data[data.length - 1].id + 1,
      date: new Date(),
      value: bidDto.value,
      auctionId: bidDto.auctionId,
      userId: bidDto.userId,
    };

    data.push(createdBid);

    return createdBid;
  }
}
