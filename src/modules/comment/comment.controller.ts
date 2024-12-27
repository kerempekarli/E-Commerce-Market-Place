import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async findAll() {
    return this.commentService.findAll();
  }

  @Post()
  async create(
    @Body() body: { userId: number; productId: number; content: string },
  ) {
    return this.commentService.createComment(body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.commentService.deleteComment(Number(id));
    return { message: 'Comment deleted' };
  }
}
