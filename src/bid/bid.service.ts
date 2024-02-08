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
      order: { value: 'desc' },
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
      order: { value: 'desc' },
    });
  }

  async create(bidDto: BidDto): Promise<BidDto> {
    if (!bidDto.value || !bidDto.auctionId || !bidDto.userId) {
      throw new BadRequestException(MISSING_FIELDS);
    }

    const auction = await this.auctionService.getById(bidDto.auctionId);
    if (!auction) {
      throw new BadRequestException('The auction does not exists');
    }

    const user = await this.userService.getById(bidDto.userId);
    if (!user) {
      throw new BadRequestException('The user does not exists');
    }

    const mostRecentBid = await this.bidRepository.findOne({
      where: { auction: { id: bidDto.auctionId } },
      order: { value: 'desc' },
      select: {
        user: {
          id: true,
        },
      },
      relations: { user: true },
    });
    if (mostRecentBid) {
      const maxValue = mostRecentBid.value;
      const minimumBid = maxValue + auction.increments;

      if (mostRecentBid.user.id === bidDto.userId) {
        throw new ConflictException(
          'You can not bid again if you own the most recent bid',
        );
      }

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

    const createdBid = await this.bidRepository.save(bidEntity);

    return new BidDto(
      createdBid.id,
      createdBid.auction.id,
      createdBid.createdAt,
      createdBid.value,
      createdBid.user.id,
    );
  }
}
