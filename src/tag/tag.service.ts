import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TagDto } from './tag.dto';
import { TagEntity } from './tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
  ) {}

  async getAll(): Promise<TagDto[]> {
    const tags = await this.tagRepository.find();

    if (!tags.length) {
      throw new NotFoundException('There are not tags');
    }

    return tags.map((tag) => this.convertEntityToDto(tag));
  }

  async getByIds(ids: number[]): Promise<TagEntity[]> {
    return await this.tagRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async create(tagDto: TagDto): Promise<TagDto> {
    if (!tagDto.name) {
      throw new BadRequestException('The name is required');
    }

    const tagExists = await this.tagRepository.countBy({
      name: tagDto.name,
    });
    if (tagExists) {
      throw new ConflictException('Tag already exists');
    }

    const tag = this.tagRepository.create({
      name: tagDto.name,
    });

    const savedTag = await this.tagRepository.save(tag);

    return this.convertEntityToDto(savedTag);
  }

  private convertEntityToDto = (entity: TagEntity) => {
    return new TagDto(entity.id, entity.name);
  };
}
