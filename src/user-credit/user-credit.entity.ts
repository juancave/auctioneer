import { UserEntity } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('user_credit')
export class UserCreditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  value: number;

  @Column()
  state: string;

  @Column()
  type: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
