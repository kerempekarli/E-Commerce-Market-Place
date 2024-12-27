import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Variant } from './variant.entity';

@Entity()
export class VariantOption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Variant, (variant) => variant.options, {
    onDelete: 'CASCADE',
  })
  variant: Variant;

  @Column()
  name: string; // Seçenek adı (örn: "Red", "Blue", "M", "L", "Sport Model" vs.)

  @Column({ default: 0 })
  stock: number; // Bu seçeneğin stok miktarı

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  priceModifier: number | null; // Bu seçeneğin fiyat farkı (örn: XL için +5 TL)
}
