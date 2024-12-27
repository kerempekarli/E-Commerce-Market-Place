import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find({ relations: ['user', 'product'] });
  }

  async createComment(data: { userId: number; productId: number; content: string }): Promise<Comment> {
    const comment = this.commentRepository.create({
      user: { id: data.userId },
      product: { id: data.productId },
      content: data.content,
    });
    return this.commentRepository.save(comment);
  }

  async deleteComment(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
