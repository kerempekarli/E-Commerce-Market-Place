import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Variant } from './entities/variant.entity';
import { VariantOption } from './entities/variant-option.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(VariantOption)
    private readonly variantOptionRepository: Repository<VariantOption>,
  ) {}

  /**
   * Yeni bir ürün oluşturur.
   * Ürüne ait varyant ve varyant seçeneklerini de kaydeder.
   */
  async createProduct(data: {
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
  }): Promise<Product> {
    // Entity’leri create ile oluşturuyoruz.
    const product = this.productRepository.create({
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock ?? 0,
      variants: data.variants?.map((variant) =>
        this.variantRepository.create({
          name: variant.name,
          options: variant.options?.map((option) => this.variantOptionRepository.create(option)),
        }),
      ),
    });

    // Veritabanına kaydetme
    return this.productRepository.save(product);
  }

  /**
   * Tüm ürünleri, varyantları ve varyant seçeneklerini birlikte getirir.
   */
  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['variants', 'variants.options'],
    });
  }

  /**
   * ID’si verilen ürünü ilişkili varyantları ve seçenekleriyle birlikte döndürür.
   */
  async findOne(id: number): Promise<Product> {
    return this.productRepository.findOne({
      where: { id },
      relations: ['variants', 'variants.options'],
    });
  }

  /**
   * Bir ürünü günceller (örneğin ürün adını, fiyatını vb.).
   * Varyant yönetimini de burada yapabilirsiniz, ancak ek mantık gerektirebilir.
   */
  async updateProduct(id: number, updateData: Partial<Product>): Promise<Product> {
    await this.productRepository.update(id, updateData);
    return this.findOne(id);
  }

  /**
   * Bir ürünü (içindeki varyant ve seçenekleriyle birlikte) veritabanından siler.
   */
  async removeProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async addVariantOption(variantId: number, optionData: { name: string; stock: number; priceModifier?: number }): Promise<VariantOption> {
    const variant = await this.variantRepository.findOne({ where: { id: variantId } });
    if (!variant) {
      throw new NotFoundException(`Variant with ID ${variantId} not found`);
    }
    const newOption = this.variantOptionRepository.create(optionData);
    newOption.variant = variant;
    return this.variantOptionRepository.save(newOption);
  }
}
