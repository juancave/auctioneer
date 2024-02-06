import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserDto } from './user.dto';
import { EMAIl_NOT_AVAILABLE, MISSING_FIELDS } from 'src/shared/constants';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async getById(id: number): Promise<UserEntity> {
    return this.userRepository.findOneBy({ id });
  }

  async create(userDto: UserDto): Promise<UserEntity> {
    if (!userDto.email || !userDto.name) {
      throw new BadRequestException(MISSING_FIELDS);
    }

    const userExists = await this.userRepository.countBy({
      email: userDto.email,
    });
    if (userExists) {
      throw new ConflictException(EMAIl_NOT_AVAILABLE);
    }

    const user = this.userRepository.create({
      email: userDto.email,
      name: userDto.name,
    });

    return await this.userRepository.save(user);
  }
}
