import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Product])],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
