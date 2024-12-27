import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { Variant } from './entities/variant.entity';
import { VariantOption } from './entities/variant-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Variant, VariantOption])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
