import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartService.findCartByUserId(Number(userId));
  }

  @Post('add')
  async addItem(
    @Body() body: { userId: number; productId: number; quantity: number },
  ) {
    return this.cartService.addItemToCart(
      body.userId,
      body.productId,
      body.quantity,
    );
  }

  @Delete('item/:itemId')
  async removeItem(@Param('itemId') itemId: string) {
    await this.cartService.removeItemFromCart(Number(itemId));
    return { message: 'Item removed from cart' };
  }

  @Delete('clear/:userId')
  async clearCart(@Param('userId') userId: string) {
    await this.cartService.clearCart(Number(userId));
    return { message: 'Cart cleared' };
  }
}
