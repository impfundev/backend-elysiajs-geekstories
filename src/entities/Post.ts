import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Tag } from "./Tag";

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @ManyToOne(() => User, (user) => user.posts)
  author!: User;

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable()
  tags!: Tag[];

  @Column({ nullable: true })
  description?: string;

  @Column("text")
  content!: string;

  @Column({ default: false })
  published!: boolean;

  @Column({ nullable: true })
  image?: string;

  @CreateDateColumn()
  create_at!: Date;

  @UpdateDateColumn()
  update_at!: Date;
}
