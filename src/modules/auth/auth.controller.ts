import { Controller, Get, Query, Res, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { GoogleAuthService } from './google-auth.service';
import { FacebookAuthService } from './facebook-auth.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly facebookAuthService: FacebookAuthService,
    private readonly authService: AuthService, // Ortak kullanıcı yönetimi için
  ) {}

  /**
   * Google OAuth Redirect
   */
  @Get('google')
  async googleRedirect(@Res() res: Response) {
    const url = await this.googleAuthService.generateAuthUrl();
    return res.redirect(url);
  }

  /**
   * Google OAuth Callback
   */
  @Get('google/callback')
  async googleCallback(@Query('code') code: string, @Query('state') codeVerifier: string, @Res() res: Response) {
    if (!code) {
      throw new BadRequestException('No code returned from Google');
    }

    try {
      const { claims } = await this.googleAuthService.getTokensAndUser(code, codeVerifier);

      // Kullanıcıyı bul/güncelle veya oluştur
      const jwt = await this.authService.validateOAuthUser('google', claims.sub, claims.email, claims.name);

      return res.redirect(`http://localhost:3000/oauth?token=${jwt}`);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  /**
   * Facebook OAuth Redirect
   */
  @Get('facebook')
  async facebookRedirect(@Res() res: Response) {
    const url = this.facebookAuthService.getAuthorizationUrl();
    return res.redirect(url);
  }

  /**
   * Facebook OAuth Callback
   */
  @Get('facebook/callback')
  async facebookCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      throw new BadRequestException('No code returned from Facebook');
    }

    try {
      const accessToken = await this.facebookAuthService.getAccessToken(code);
      const profile = await this.facebookAuthService.getUserProfile(accessToken);

      // Kullanıcıyı bul/güncelle veya oluştur
      const jwt = await this.authService.validateOAuthUser('facebook', profile.id, profile.email, profile.name);

      return res.redirect(`http://localhost:3000/oauth?token=${jwt}`);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
