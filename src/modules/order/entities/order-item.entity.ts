import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../product/entities/product.entity';

// src/modules/order/entities/order-item.entity.ts

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  // Hangi siparişin parçası?
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  // Hangi ürün?
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;

  // Ürün fiyatı (temel fiyat) + varyant farkları
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  // Adet
  @Column()
  quantity: number;

  // Seçilen varyant opsiyonlarının ID listesi
  // Örnek: [4, 10] -> Renk:Red(4), Beden:M(10)
  @Column('int', { array: true, nullable: true })
  variantOptionIds: number[] | null;
}
