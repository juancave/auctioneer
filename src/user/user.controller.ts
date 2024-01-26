import { Controller, Get, Param } from '@nestjs/common';
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
  getById(@Param('id') id: number): UserDto {
    return this.userService.getById(Number(id));
  }
}
