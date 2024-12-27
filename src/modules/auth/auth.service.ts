import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateOAuthUser(provider: 'google' | 'facebook', providerId: string, email: string | null, name: string): Promise<string> {
    // Kullanıcıyı sağlayıcı ve providerId ile bul
    let user = await this.userRepository.findOne({
      where: { provider, providerId },
    });

    // Kullanıcı yoksa oluştur
    if (!user) {
      user = this.userRepository.create({
        provider,
        providerId,
        email,
        roles: ['CUSTOMER'], // Varsayılan rol
      });
      await this.userRepository.save(user);
    }

    // JWT oluştur ve döndür
    const payload = { sub: user.id, roles: user.roles };
    return this.jwtService.sign(payload);
  }
}
