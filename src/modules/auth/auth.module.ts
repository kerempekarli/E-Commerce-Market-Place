import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleAuthController } from './google-auth.controller';
import { FacebookAuthController } from './facebook-auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret', // Gizli anahtar
      signOptions: { expiresIn: '1h' }, // Token geçerlilik süresi
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController, GoogleAuthController, FacebookAuthController],
})
export class AuthModule {}
