import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async findAll() {
    return this.reviewService.findAll();
  }

  @Post()
  async create(
    @Body()
    body: {
      rating: number;
      comment: string;
      userId: number;
      productId: number;
    },
  ) {
    return this.reviewService.createReview({
      rating: body.rating,
      comment: body.comment,
      user: { id: body.userId },
      product: { id: body.productId },
    });
  }
}
