import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Tüm ürünleri getir
   */
  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  /**
   * Belirli ID'li ürünü getir
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(+id);
  }

  /**
   * Yeni ürün oluştur
   */
  @Post()
  async create(
    @Body()
    body: {
      name: string;
      description: string;
      price: number;
      stock?: number;
      variants?: {
        name: string;
        options: {
          name: string;
          stock: number;
          priceModifier?: number;
        }[];
      }[];
    },
  ): Promise<Product> {
    return this.productService.createProduct(body);
  }

  /**
   * Ürün güncelle
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Product>): Promise<Product> {
    return this.productService.updateProduct(+id, updateData);
  }

  /**
   * Ürün sil
   */
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.productService.removeProduct(+id);
  }
}
