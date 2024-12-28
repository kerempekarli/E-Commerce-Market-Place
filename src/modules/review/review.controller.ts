import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Post()
  async createReview(
    @Body()
    body: {
      userId: number;
      productId: number;
      rating: number;
      comment: string;
    },
  ) {
    return this.reviewService.createReview(body);
  }

  @Delete(':id')
  async deleteReview(@Param('id') id: string) {
    return this.reviewService.deleteReview(+id);
  }
}
