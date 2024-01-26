import { Injectable } from '@nestjs/common';
import { BidDto } from './bid.dto';

const data: BidDto[] = [
  { id: 1, auctionId: 1, date: new Date(), value: 200, userId: 1 },
  { id: 2, auctionId: 1, date: new Date(), value: 400, userId: 2 },
  { id: 3, auctionId: 1, date: new Date(), value: 410, userId: 1 },
  { id: 4, auctionId: 1, date: new Date(), value: 420, userId: 2 },
  { id: 5, auctionId: 1, date: new Date(), value: 440, userId: 1 },
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
}
