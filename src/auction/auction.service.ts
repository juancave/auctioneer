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
import { isValidISODate } from 'src/shared/util/dates';
import { TagService } from 'src/tag/tag.service';
import { TagEntity } from 'src/tag/tag.entity';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(AuctionEntity)
    private auctionRepository: Repository<AuctionEntity>,
    private tagsService: TagService,
  ) {}

  async getAll(): Promise<AuctionDto[]> {
    const auctions = await this.auctionRepository.find({
      select: {
        tags: {
          name: true,
        },
      },
      relations: { tags: true },
      order: { id: 'desc' },
    });

    if (!auctions.length) {
      throw new NotFoundException('There are not auctions');
    }

    return auctions.map((auction) => this.convertEntityToDto(auction));
  }

  async getById(id: number): Promise<AuctionDto> {
    const auctions = await this.auctionRepository.find({
      where: {
        id,
      },
      select: {
        tags: {
          name: true,
        },
      },
      relations: { tags: true },
    });

    if (!auctions.length) {
      throw new NotFoundException('The auction was not found');
    }

    return this.convertEntityToDto(auctions[0]);
  }

  async findOneById(id: number): Promise<AuctionEntity> {
    return this.auctionRepository.findOneBy({ id });
  }

  async create(auctionDto: AuctionDto): Promise<AuctionDto> {
    if (
      !auctionDto.description ||
      !auctionDto.startsOn ||
      !auctionDto.endsOn ||
      !auctionDto.increments ||
      !auctionDto.minBid ||
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

    const startsOnDate = isValidISODate(auctionDto.startsOn);
    if (!startsOnDate) {
      throw new BadRequestException(
        'The field startsOn is not a valid ISO date',
      );
    }

    const endsOnDate = isValidISODate(auctionDto.endsOn);
    if (!endsOnDate) {
      throw new BadRequestException('The field endsOn is not a valid ISO date');
    }

    const auctionExists = await this.auctionRepository.countBy({
      description: auctionDto.description,
    });

    if (auctionExists) {
      throw new ConflictException(ALREADY_EXISTS);
    }

    const tags: TagEntity[] = await this.getTagEntities(auctionDto);

    const auction = this.auctionRepository.create({
      description: auctionDto.description,
      startsOn: startsOnDate,
      endsOn: endsOnDate,
      increments: auctionDto.increments,
      minBid: auctionDto.minBid,
      value: auctionDto.value,
      state: auctionDto.state,
      tags,
    });

    const savedAuction = await this.auctionRepository.save(auction);

    return this.convertEntityToDto(savedAuction);
  }

  private getTagEntities = async (auctionDto: AuctionDto) => {
    if (auctionDto.tags?.length) {
      const ids = auctionDto.tags.reduce(
        (tags: number[], tag: string | number) => {
          if (Number(tag)) {
            tags.push(Number(tag));
          }

          return tags;
        },
        [] as number[],
      );

      return await this.tagsService.getByIds(ids);
    }

    return undefined;
  };

  private convertEntityToDto = (entity: AuctionEntity): AuctionDto => {
    return new AuctionDto(
      entity.id,
      entity.description,
      entity.startsOn.toISOString(),
      entity.endsOn.toISOString(),
      entity.createdAt,
      entity.value,
      entity.minBid,
      entity.increments,
      entity.state as AuctionState,
      entity.tags?.map((tag) => tag.name) || [],
    );
  };
}
