import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { AuctionDto, AuctionState } from './auction.dto';
import { ALREADY_EXISTS, MISSING_FIELDS } from 'src/shared/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { AuctionEntity } from './auction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(AuctionEntity)
    private auctionRepository: Repository<AuctionEntity>,
  ) {}

  async getAll(): Promise<AuctionEntity[]> {
    return await this.auctionRepository.find();
  }

  async getById(id: number): Promise<AuctionEntity> {
    return this.auctionRepository.findOneBy({ id });
  }

  async create(auctionDto: AuctionDto): Promise<AuctionEntity> {
    if (
      !auctionDto.description ||
      !auctionDto.increments ||
      !auctionDto.startsOn ||
      !auctionDto.value ||
      !auctionDto.state
    ) {
      throw new BadRequestException(MISSING_FIELDS);
    }

    if (
      !Object.values(AuctionState).includes(auctionDto.state as AuctionState)
    ) {
      throw new BadRequestException(
        `The state is not valid. Valid options are: ${Object.values(AuctionState)}`,
      );
    }

    const auctionExists = await this.auctionRepository.countBy({
      description: auctionDto.description,
    });

    if (auctionExists) {
      throw new ConflictException(ALREADY_EXISTS);
    }

    const auction = this.auctionRepository.create({
      description: auctionDto.description,
      increments: auctionDto.increments,
      startsOn: auctionDto.startsOn,
      value: auctionDto.value,
      state: auctionDto.state,
    });

    return this.auctionRepository.save(auction);
  }
}
