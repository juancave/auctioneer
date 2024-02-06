import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { BidDto } from './bid.dto';
import { MISSING_FIELDS } from 'src/shared/constants';
import { AuctionService } from '../auction/auction.service';
import { UserService } from '../user/user.service';
import { BidEntity } from './bid.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(BidEntity)
    private bidRepository: Repository<BidEntity>,
    private userService: UserService,
    private auctionService: AuctionService,
  ) {}

  async getByAuctionId(auctionId: number): Promise<BidEntity[]> {
    return await this.bidRepository.find({
      where: { auction: { id: auctionId } },
      select: {
        user: {
          name: true,
        },
      },
      relations: { user: true },
    });
  }

  async getByUserId(auctionId: number, userId: number): Promise<BidEntity[]> {
    return await this.bidRepository.find({
      where: {
        auction: { id: auctionId },
        user: { id: userId },
      },
      select: {
        user: {
          name: true,
        },
      },
      relations: { user: true },
    });
  }

  async create(bidDto: BidDto): Promise<BidEntity> {
    if (!bidDto.value || !bidDto.auctionId || !bidDto.userId) {
      throw new BadRequestException(MISSING_FIELDS);
    }

    const auction = await this.auctionService.getById(bidDto.auctionId);
    if (!auction) {
      throw new ConflictException('The auction does not exists');
    }

    const user = await this.userService.getById(bidDto.userId);
    if (!user) {
      throw new ConflictException('The user does not exists');
    }

    const currentBids = await this.bidRepository.findBy({
      auction: { id: bidDto.auctionId },
    });
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

    const bidEntity: BidEntity = this.bidRepository.create({
      value: bidDto.value,
      auction,
      user,
    });

    return await this.bidRepository.save(bidEntity);
  }
}
