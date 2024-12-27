import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string; // Yorum içeriği

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  user: User; // Yorumu yapan kullanıcı

  @ManyToOne(() => Product, (product) => product.comments, { onDelete: 'CASCADE' })
  product: Product; // Yorumu yapılan ürün

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
