import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleAuthService {
  private clientId = process.env.GOOGLE_CLIENT_ID;
  private clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  private redirectUri = process.env.GOOGLE_REDIRECT_URI;

  /**
   * Google OAuth giriş URL'sini oluşturur.
   */
  async generateAuthUrl(): Promise<string> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state: 'code_verifier',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Google'dan token ve kullanıcı bilgilerini alır.
   */
  async getTokensAndUser(code: string, codeVerifier: string) {
    // Token almak için Google'a istek gönder
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    });

    const tokenSet = tokenResponse.data;

    // Token içindeki kullanıcı bilgilerini al
    const userInfoResponse = await axios.get('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenSet.access_token}`,
      },
    });

    return {
      tokenSet,
      claims: userInfoResponse.data, // Kullanıcı bilgileri
    };
  }
}
