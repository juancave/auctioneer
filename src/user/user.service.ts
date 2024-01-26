import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';

const data: UserDto[] = [
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
}
