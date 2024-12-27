import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';
import { Review } from '../../review/entities/review.entity';

import { Product } from '../../product/entities/product.entity'; // İleride oluşturulacak
import { Order } from '../../order/entities/order.entity'; // İleride oluşturulacak
import { Comment } from '../../comment/entities/comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  email: string | null; // Bazı OAuth kullanıcılarında e-posta olmayabilir.

  @Column({ nullable: true })
  password: string | null; // Şifre sadece 'local' kullanıcılar için gerekli.

  @Column({ default: 'local' })
  provider: string; // OAuth sağlayıcı: 'google', 'facebook', 'local'

  @Column({ nullable: true })
  providerId: string | null; // Google veya Facebook'tan gelen kullanıcı ID

  @Column('text', { array: true, default: ['CUSTOMER'] })
  roles: string[]; // Kullanıcı rolleri

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
