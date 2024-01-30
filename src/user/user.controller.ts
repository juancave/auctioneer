import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(): UserDto[] {
    return this.userService.getAll();
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number): UserDto {
    return this.userService.getById(id);
  }

  @Post()
  create(@Body() userDto: UserDto): UserDto {
    return this.userService.create(userDto);
  }
}
