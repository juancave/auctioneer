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
  getAll(): Promise<UserDto[]> {
    return this.userService.getAll();
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.userService.getById(id);
  }

  @Post()
  create(@Body() userDto: UserDto): Promise<UserDto> {
    return this.userService.create(userDto);
  }
}
