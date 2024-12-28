import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from 'src/modules/payment/entities/payment.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // Siparişin hangi kullanıcıya ait olduğunu tutuyoruz.
  // "customer" veya "buyer" şeklinde de adlandırılabilir.
  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  customer: User;

  // Sipariş durumu: örn. PENDING, PAID, SHIPPED, COMPLETED vb.
  @Column({ default: 'PENDING' })
  status: string;

  // Toplam tutar (OrderItem'ların toplamından hesaplanabilir).
  // TypeORM tipini 'decimal' seçerseniz precision/scale belirtebilirsiniz.
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  // Sipariş oluşturma tarihi
  @CreateDateColumn()
  createdAt: Date;

  // Siparişin güncellenme tarihi
  @UpdateDateColumn()
  updatedAt: Date;

  // Siparişe ait kalemler (ürün detayları)
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[]; // Payment ile ilişki
}
