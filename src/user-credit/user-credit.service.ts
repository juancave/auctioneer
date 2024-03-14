import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserCreditDto } from './user-credit.dto';
import { MISSING_FIELDS } from 'src/shared/constants';
import { UserCreditEntity } from './user-credit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserCreditService {
  constructor(
    @InjectRepository(UserCreditEntity)
    private userCreditRepository: Repository<UserCreditEntity>,
    private userService: UserService,
  ) {}

  async getCredits(userId: number): Promise<UserCreditDto[]> {
    const userCredits = await this.userCreditRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
      },
    });

    if (!userCredits.length) {
      throw new NotFoundException('There are not credits for the user');
    }

    return userCredits.map((userCredit) => this.convertEntityToDto(userCredit));
  }

  async create(userCreditDto: UserCreditDto): Promise<UserCreditDto> {
    if (!userCreditDto.userId || !userCreditDto.value) {
      throw new BadRequestException(MISSING_FIELDS);
    }

    const user = await this.userService.getById(userCreditDto.userId);
    if (!user) {
      throw new BadRequestException('The user does not exists');
    }

    const userCredit = this.userCreditRepository.create({
      value: userCreditDto.value,
      state: 'applied',
      type: 'deposit',
      user,
    });

    const savedUserCredit = await this.userCreditRepository.save(userCredit);

    return this.convertEntityToDto(savedUserCredit);
  }

  private convertEntityToDto = (entity: UserCreditEntity) => {
    return new UserCreditDto(
      entity.id,
      entity.value,
      entity.state,
      entity.type,
      entity.user.id,
    );
  };
}
