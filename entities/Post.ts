import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";
import { Tag } from "./Tag";

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @ManyToOne(() => User, user => user.posts)
  author!: User;

  @ManyToMany(() => Tag, tag => tag.posts)
  @JoinTable()
  tags!: Tag[];

  @Column({ nullable: true })
  description?: string;

  @Column("text")
  content!: string;
}
