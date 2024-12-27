import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async findCartByUserId(userId: number): Promise<Cart> {
    return this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });
  }

  async addItemToCart(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId }, items: [] });
      cart = await this.cartRepository.save(cart);
    }

    const existingItem = cart.items.find(
      (item) => item.product.id === productId,
    );
    if (existingItem) {
      existingItem.quantity += quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const newItem = this.cartItemRepository.create({
        cart,
        product: { id: productId },
        quantity,
      });
      await this.cartItemRepository.save(newItem);
    }

    return this.findCartByUserId(userId);
  }

  async removeItemFromCart(cartItemId: number): Promise<void> {
    await this.cartItemRepository.delete(cartItemId);
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.findCartByUserId(userId);
    if (cart) {
      await this.cartItemRepository.remove(cart.items);
    }
  }
}
