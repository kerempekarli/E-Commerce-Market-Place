import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find({ relations: ['user', 'product'] });
  }

  async findOne(id: number): Promise<Review> {
    return this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });
  }

  async createReview(data: { userId: number; productId: number; rating: number; comment: string }): Promise<Review> {
    const user = await this.userRepository.findOne({ where: { id: data.userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const product = await this.productRepository.findOne({ where: { id: data.productId } });
    if (!product) {
      throw new Error('Product not found');
    }

    const review = this.reviewRepository.create({
      user,
      product,
      rating: data.rating,
      comment: data.comment,
    });

    return this.reviewRepository.save(review);
  }

  async deleteReview(id: number): Promise<void> {
    const review = await this.findOne(id);
    if (!review) {
      throw new Error('Review not found');
    }
    await this.reviewRepository.remove(review);
  }
}
