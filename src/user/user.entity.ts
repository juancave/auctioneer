import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 80 })
  email: string;

  @Column({ default: 0 })
  currentBalance: number;
}
