// src/modules/auth/google-auth.controller.ts
import { Controller, Get, Query, Req, Res, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { GoogleAuthService } from './google-auth.service';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  /**
   * Google OAuth akışını başlatır:
   * 1) Auth URL oluşturur
   * 2) Kullanıcıyı Google'a yönlendirir
   */
  @Get()
  async googleAuthRedirect(@Res() res: Response) {
    const url = await this.googleAuthService.generateAuthUrl();
    return res.redirect(url);
  }

  /**
   * Google’dan callback alır.
   * https://yourdomain.com/auth/google/callback?code=xxx&state=yyy
   */
  @Get('callback')
  async googleCallback(
    @Query('code') code: string,
    @Query('state') codeVerifier: string, // generateAuthUrl'de eklediğimiz parametre
    @Res() res: Response,
  ) {
    if (!code) {
      throw new BadRequestException('No code returned from Google');
    }

    try {
      const { tokenSet, claims } = await this.googleAuthService.getTokensAndUser(code, codeVerifier);

      // claims.email, claims.name vb. içerir
      // Burada kendi kullanıcı veritabanınızı güncelleyip JWT oluşturabilirsiniz.
      // Örnek:
      // const user = await this.authService.findOrCreateUser({
      //   provider: 'google',
      //   providerId: claims.sub,
      //   email: claims.email,
      //   name: claims.name,
      // });
      // const yourJWT = this.authService.signToken(user);

      // En sonunda front-end'e yönlendirin (Next.js vs.)
      return res.redirect(`http://localhost:3000/oauth?email=${claims.email}`);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
