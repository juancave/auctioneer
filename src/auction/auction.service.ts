import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
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

  async getAll(): Promise<AuctionDto[]> {
    const auctions = await this.auctionRepository.find();

    if (!auctions.length) {
      throw new NotFoundException('There are not auctions');
    }

    return auctions.map((auction) => this.convertEntityToDto(auction));
  }

  async getById(id: number): Promise<AuctionDto> {
    const auction = await this.auctionRepository.findOneBy({ id });

    if (!auction) {
      throw new NotFoundException('The auction was not found');
    }

    return this.convertEntityToDto(auction);
  }

  async create(auctionDto: AuctionDto): Promise<AuctionDto> {
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

    const savedAuction = await this.auctionRepository.save(auction);

    return this.convertEntityToDto(savedAuction);
  }

  private convertEntityToDto = (entity: AuctionEntity): AuctionDto => {
    return new AuctionDto(
      entity.id,
      entity.description,
      entity.createdAt,
      entity.value,
      entity.startsOn,
      entity.increments,
      entity.state as AuctionState,
    );
  };
}
