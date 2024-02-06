import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('auction')
export class AuctionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ length: 300 })
  description: string;

  @Column()
  value: number;

  @Column()
  startsOn: number;

  @Column()
  increments: number;

  @Column()
  state: string;
}
