import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  /**
   * Yeni bir sipariş oluştur.
   */
  async createOrder(data: { userId: number; items: { productId: number; quantity: number; price: number }[] }): Promise<Order> {
    // 1) Order oluştur
    let order = this.orderRepository.create({
      customer: { id: data.userId } as any, // User entity'sine referans
      status: 'PENDING',
      totalPrice: 0,
      items: [], // Henüz eklemedik, aşağıda ekleyeceğiz
    });

    order = await this.orderRepository.save(order);

    // 2) OrderItem oluşturma
    const orderItems: OrderItem[] = [];
    let totalPrice = 0;
    for (const item of data.items) {
      const newItem = this.orderItemRepository.create({
        order,
        product: { id: item.productId } as any, // Product referansı
        quantity: item.quantity,
        price: item.price,
      });
      totalPrice += item.price * item.quantity;
      orderItems.push(newItem);
    }
    await this.orderItemRepository.save(orderItems);

    // 3) Siparişin totalPrice alanını güncelle
    order.totalPrice = totalPrice;
    await this.orderRepository.save(order);

    return this.findOne(order.id);
  }

  /**
   * Tüm siparişleri getir (ilişkileriyle birlikte).
   */
  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['items', 'items.product', 'customer'],
    });
  }

  /**
   * Belirli id'li siparişi getir.
   */
  async findOne(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product', 'customer'],
    });
    if (!order) throw new BadRequestException('Order not found.');
    return order;
  }

  /**
   * Sipariş durumunu güncelle (ör. PENDING -> COMPLETED).
   */
  async updateStatus(orderId: number, newStatus: string): Promise<Order> {
    const order = await this.findOne(orderId);
    order.status = newStatus;
    await this.orderRepository.save(order);
    return order;
  }
}
