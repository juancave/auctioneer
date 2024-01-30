import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserDto } from './user.dto';
import { EMAIl_NOT_AVAILABLE, MISSING_FIELDS } from 'src/shared/constants';

export const data: UserDto[] = [
  { id: 1, name: 'Juan', email: 'juan@gmail.com' },
  { id: 2, name: 'Camilo', email: 'camilo@gmail.com' },
];

@Injectable()
export class UserService {
  getAll(): UserDto[] {
    return data;
  }

  getById(id: number): UserDto {
    return data.find(({ id: userId }) => userId === id);
  }

  create(userDto: UserDto): UserDto {
    if (!userDto.email || !userDto.name) {
      throw new BadRequestException(MISSING_FIELDS);
    }

    const userExists = data.some(({ email }) => email === userDto.email);
    if (userExists) {
      throw new ConflictException(EMAIl_NOT_AVAILABLE);
    }

    const createdUser: UserDto = {
      id: data[data.length - 1].id + 1,
      email: userDto.email,
      name: userDto.name,
    };

    data.push(createdUser);

    return createdUser;
  }
}
