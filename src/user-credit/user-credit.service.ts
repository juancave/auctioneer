import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreditState, CreditType, UserCreditDto } from './user-credit.dto';
import { MISSING_FIELDS } from 'src/shared/constants';
import { UserCreditEntity } from './user-credit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/user.entity';

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
      order: {
        id: 'desc',
      },
    });

    if (!userCredits.length) {
      throw new NotFoundException('There are not credits for the user');
    }

    return userCredits.map((userCredit) => this.convertEntityToDto(userCredit));
  }

  async createDeposit(userCreditDto: UserCreditDto): Promise<UserCreditDto> {
    if (!userCreditDto.userId || !userCreditDto.value) {
      throw new BadRequestException(MISSING_FIELDS);
    }

    const user = await this.userService.getEntityById(userCreditDto.userId);
    if (!user) {
      throw new BadRequestException('The user does not exists');
    }

    const userCredit = await this.create(
      userCreditDto.value,
      user,
      CreditType.DEPOSIT,
      CreditState.APPLIED,
    );

    user.currentBalance = user.currentBalance + userCreditDto.value;

    await this.userService.updateEntity(user);

    return this.convertEntityToDto(userCredit);
  }

  async createForBid(
    value: number,
    user: UserEntity,
    type: string,
    state: string,
  ): Promise<UserCreditEntity> {
    return await this.create(value, user, type, state);
  }

  private async create(
    value: number,
    user: UserEntity,
    type: string,
    state: string,
  ): Promise<UserCreditEntity> {
    const userCredit = this.userCreditRepository.create({
      value,
      state,
      type,
      user,
    });

    return await this.userCreditRepository.save(userCredit);
  }

  async changeState(id: number, state: string): Promise<void> {
    const userCredit = await this.userCreditRepository.findOne({
      where: { id },
    });

    if (userCredit) {
      userCredit.state = state;
      await this.userCreditRepository.save(userCredit);
    }
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
