import { TagEntity } from 'src/tag/tag.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('auction')
export class AuctionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  startsOn: Date;

  @Column()
  endsOn: Date;

  @Column({ length: 300 })
  description: string;

  @Column()
  value: number;

  @Column()
  minBid: number;

  @Column()
  increments: number;

  @Column()
  state: string;

  @ManyToMany(() => TagEntity)
  @JoinTable()
  tags: TagEntity[];
}
