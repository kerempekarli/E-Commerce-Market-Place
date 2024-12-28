import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleAuthService } from './google-auth.service';
import { FacebookAuthService } from './facebook-auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret', // Gizli anahtar
      signOptions: { expiresIn: '1h' }, // Token geçerlilik süresi
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleAuthService, FacebookAuthService],
  controllers: [AuthController]
})
export class AuthModule {}
