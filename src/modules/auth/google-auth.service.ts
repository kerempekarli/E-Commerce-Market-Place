// src/modules/auth/google-auth.service.ts

import { Injectable } from '@nestjs/common';
const openid = require('openid-client');
const { Issuer, Client, generators } = openid;

@Injectable()
export class GoogleAuthService {
  private googleClient: InstanceType<typeof Client>; // Tip olarak kullanımı düzeltiyoruz

  constructor() {
    // Bu constructor içinde Google Issuer'ı discover ediyoruz (async yapılarda await gerekir).
    // Production'da bu adımı constructor yerine onModuleInit gibi bir yerde yapıp
    // googleClient’ı önceden hazırlayabilirsiniz.
  }

  async initClient() {
    if (!this.googleClient) {
      const googleIssuer = await Issuer.discover('https://accounts.google.com');
      // .env veya ConfigService'den çekin
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const redirectUri = process.env.GOOGLE_REDIRECT_URI;
      // Örneğin: http://localhost:3000/auth/google/callback

      this.googleClient = new googleIssuer.Client({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uris: [redirectUri],
        response_types: ['code'],
      });
    }
    return this.googleClient;
  }

  /**
   * Kullanıcıyı Google Login sayfasına yönlendirmek için
   * authorizationUrl oluşturur.
   */
  async generateAuthUrl(): Promise<string> {
    const client = await this.initClient();
    // PKCE code_verifier ve code_challenge oluşturma
    const codeVerifier = generators.codeVerifier();
    const codeChallenge = generators.codeChallenge(codeVerifier);

    // Google'a yönlendireceğimiz URL parametreleri
    const authorizationUrl = client.authorizationUrl({
      scope: 'openid email profile',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      // state, prompt vb. ek parametreler de eklenebilir
    });

    // Bu codeVerifier’ı session veya redis’te saklamak gerek,
    // callback geldiğinde doğrulayacaksınız.
    // Burada basitlik için geri döndürdük.
    return `${authorizationUrl}&state=${codeVerifier}`;
  }

  /**
   * Google callback aşamasında, authorization code'u alıp
   * token'ları elde eder. Ardından kullanıcı bilgilerini döndürür.
   */
  async getTokensAndUser(code: string, codeVerifier: string) {
    const client = await this.initClient();

    const tokenSet = await client.callback(
      // Sizin redirect_uri
      process.env.GOOGLE_REDIRECT_URI,
      { code, code_verifier: codeVerifier },
      { code_verifier: codeVerifier },
    );

    // tokenSet içinde access_token, id_token, expires_at vb. var.
    // id_token'ı decode ederek email, sub (Google user id), name vb. bilgileri alabilirsiniz.
    const claims = tokenSet.claims();

    return {
      tokenSet,
      claims, // => { sub: 'googleUserId', email: '...', name: '...' }
    };
  }
}
