import { Body, Controller, Get, Post } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagDto } from './tag.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  getAll(): Promise<TagDto[]> {
    return this.tagService.getAll();
  }

  @Post()
  create(@Body() tagDto: TagDto): Promise<TagDto> {
    return this.tagService.create(tagDto);
  }
}
