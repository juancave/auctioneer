import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BidDto } from './bid.dto';
import { MISSING_FIELDS } from 'src/shared/constants';
import { AuctionService } from '../auction/auction.service';
import { UserService } from '../user/user.service';
import { BidEntity } from './bid.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreditService } from 'src/user-credit/user-credit.service';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(BidEntity)
    private bidRepository: Repository<BidEntity>,
    private userService: UserService,
    private auctionService: AuctionService,
    private userCreditService: UserCreditService,
  ) {}

  async getByAuctionId(auctionId: number): Promise<BidDto[]> {
    const bids = await this.bidRepository.find({
      where: { auction: { id: auctionId } },
      select: {
        user: {
          id: true,
        },
        auction: {
          id: true,
        },
      },
      relations: { user: true, auction: true },
      order: { value: 'desc' },
    });

    if (!bids.length) {
      throw new NotFoundException('There are not bids for the provided input');
    }

    return bids.map((bid) => this.convertEntityToDto(bid));
  }

  async getByUserId(auctionId: number, userId: number): Promise<BidDto[]> {
    const bids = await this.bidRepository.find({
      where: {
        auction: { id: auctionId },
        user: { id: userId },
      },
      select: {
        user: {
          id: true,
        },
        auction: {
          id: true,
        },
      },
      relations: { user: true, auction: true },
      order: { value: 'desc' },
    });

    if (!bids.length) {
      throw new NotFoundException('There are not bids for the provided input');
    }

    return bids.map((bid) => this.convertEntityToDto(bid));
  }

  async create(bidDto: BidDto): Promise<BidDto> {
    if (!bidDto.value || !bidDto.auctionId || !bidDto.userId) {
      throw new BadRequestException(MISSING_FIELDS);
    }

    const auction = await this.auctionService.findOneById(bidDto.auctionId);
    if (!auction) {
      throw new BadRequestException('The auction does not exists');
    }

    const user = await this.userService.getEntityById(bidDto.userId);
    if (!user) {
      throw new BadRequestException('The user does not exists');
    }

    if (new Date() > auction.endsOn) {
      throw new ConflictException('The auction is not longer available');
    }

    const mostRecentBid = await this.bidRepository.findOne({
      where: { auction: { id: bidDto.auctionId } },
      order: { value: 'desc' },
      select: {
        user: {
          id: true,
        },
        credit: {
          id: true,
        },
      },
      relations: { user: true, credit: true },
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

    if (bidDto.value < auction.minBid) {
      throw new ConflictException(
        `The provided value is less than the minimun bid of ${auction.minBid}`,
      );
    }

    if (bidDto.value > auction.value) {
      throw new ConflictException(
        `The provided value is highter than the buyout value of ${auction.value}`,
      );
    }

    if (mostRecentBid) {
      await this.userCreditService.changeState(
        mostRecentBid.credit.id,
        'outbid',
      );
    }

    const isBuyout = bidDto.value === auction.value;
    const type = isBuyout ? 'buyout' : 'bid';
    const state = isBuyout ? 'applied' : 'pending';

    const credit = await this.userCreditService.createForBid(
      bidDto.value,
      user,
      type,
      state,
    );

    const bidEntity: BidEntity = this.bidRepository.create({
      value: bidDto.value,
      auction,
      user,
      credit,
    });

    const createdBid = await this.bidRepository.save(bidEntity);

    return this.convertEntityToDto(createdBid);
  }

  private convertEntityToDto = (entity: BidEntity) => {
    return new BidDto(
      entity.id,
      entity.auction.id,
      entity.createdAt,
      entity.value,
      entity.user.id,
    );
  };
}
