// src/modules/auth/facebook-auth.controller.ts

import { Controller, Get, Query, BadRequestException, Res } from '@nestjs/common';
import { Response } from 'express';
import { FacebookAuthService } from './facebook-auth.service';

@Controller('auth/facebook')
export class FacebookAuthController {
  constructor(private readonly fbService: FacebookAuthService) {}

  @Get()
  async facebookRedirect(@Res() res: Response) {
    const authUrl = this.fbService.getAuthorizationUrl();
    // Kullanıcıyı Facebook OAuth sayfasına yönlendir
    return res.redirect(authUrl);
  }

  @Get('callback')
  async facebookCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      throw new BadRequestException('No code returned from Facebook');
    }

    try {
      // 1) Access Token al
      const accessToken = await this.fbService.getAccessToken(code);

      // 2) Kullanıcı profilini al
      const profile = await this.fbService.getUserProfile(accessToken);

      // Örneğin: { id: 'xxx', name: 'John Doe', email: 'john@example.com' }
      // Kendi veritabanında user kaydı/güncellemesi yap.
      // JWT oluştur vs.

      // En sonunda front-end'e yönlendir
      return res.redirect(`http://localhost:3000/oauth?email=${profile.email}`);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
