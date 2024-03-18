import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
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

  async getAll(): Promise<UserDto[]> {
    const users = await this.userRepository.find();

    if (!users.length) {
      throw new NotFoundException('There are not users');
    }

    return users.map((user) => this.convertEntityToDto(user));
  }

  async getById(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('The user was not found');
    }

    return this.convertEntityToDto(user);
  }

  async getEntityById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('The user was not found');
    }

    return user;
  }

  async create(userDto: UserDto): Promise<UserDto> {
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

    const savedUser = await this.userRepository.save(user);

    return this.convertEntityToDto(savedUser);
  }

  private convertEntityToDto = (entity: UserEntity) => {
    return new UserDto(entity.id, entity.email, entity.name);
  };
}
