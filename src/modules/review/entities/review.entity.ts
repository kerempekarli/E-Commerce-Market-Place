import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', width: 1 })
  rating: number; // 1-5 arasında puan

  @Column({ type: 'text' })
  comment: string; // Yorum metni

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user: User; // Yorumu yapan kullanıcı

  @ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE' })
  product: Product; // Yorumu yapılan ürün

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
