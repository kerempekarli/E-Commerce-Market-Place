import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { VariantOption } from './variant-option.entity';

@Entity()
export class Variant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column()
  name: string; // Varyant adı (örn: "Color", "Size", "Model")

  @OneToMany(() => VariantOption, (option) => option.variant, {
    cascade: true,
  })
  options: VariantOption[];
}
