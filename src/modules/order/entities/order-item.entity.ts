import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  // Bu OrderItem hangi siparişe ait?
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  // Ürün. Örneğin tekil bir Product’a referans veriyoruz.
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;

  // Bu kalem için adet
  @Column({ default: 1 })
  quantity: number;

  // Bu kalem için ürünün fiyatı (varyant farkları dahil)
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number;
}
