import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { VariantOption } from '../product/entities/variant-option.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(VariantOption)
    private readonly variantOptionRepository: Repository<VariantOption>,
  ) {}

  async createOrder(orderData: {
    userId: number;
    items: {
      productId: number;
      quantity: number;
      variantOptionIds?: number[];
    }[];
  }): Promise<Order> {
    // 1. Order oluştur
    const order = this.orderRepository.create({
      user: { id: orderData.userId } as any,
    });

    // 2. Order kaydet
    const savedOrder = await this.orderRepository.save(order);

    // 3. OrderItems oluşturma
    const orderItems: OrderItem[] = [];
    for (const item of orderData.items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new BadRequestException(`Product with ID ${item.productId} not found`);
      }

      // 4. Varyant seçenekleri stok kontrolü ve fiyat hesaplama
      let totalPrice = product.price; // Temel ürün fiyatı
      if (item.variantOptionIds && item.variantOptionIds.length > 0) {
        const variantOptions = await this.variantOptionRepository.findByIds(item.variantOptionIds);

        if (variantOptions.length !== item.variantOptionIds.length) {
          throw new BadRequestException(`Some variant options not found.`);
        }

        // Her bir varyant opsiyonun stok ve fiyat farkını ekle
        for (const option of variantOptions) {
          if (option.stock < item.quantity) {
            throw new BadRequestException(`Insufficient stock for variant option: ${option.name}`);
          }
          // Fiyata opsiyon farkını ekle (null ise 0 say)
          totalPrice += option.priceModifier ?? 0;
        }

        // Stok düşürme
        for (const option of variantOptions) {
          option.stock -= item.quantity;
          await this.variantOptionRepository.save(option);
        }
      }

      const newItem = this.orderItemRepository.create({
        order: savedOrder,
        product: product,
        quantity: item.quantity,
        price: totalPrice,
        variantOptionIds: item.variantOptionIds || null,
      });

      orderItems.push(newItem);
    }

    // 5. Tüm orderItems kaydet
    await this.orderItemRepository.save(orderItems);

    // 6. Siparişi ilişkileriyle birlikte geri döndür
    return this.findOne(savedOrder.id);
  }

  async findOne(orderId: number): Promise<Order> {
    return this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });
  }
}
