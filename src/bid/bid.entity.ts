import { AuctionEntity } from 'src/auction/auction.entity';
import { UserCreditEntity } from 'src/user-credit/user-credit.entity';
import { UserEntity } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('bid')
export class BidEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  value: number;

  @ManyToOne(() => AuctionEntity)
  @JoinColumn()
  auction: AuctionEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => UserCreditEntity)
  @JoinColumn()
  credit: UserCreditEntity;
}
