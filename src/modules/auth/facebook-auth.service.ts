// src/modules/auth/facebook-auth.service.ts
import { Injectable } from '@nestjs/common';
import { create, ModuleOptions } from 'simple-oauth2';
import axios from 'axios';

@Injectable()
export class FacebookAuthService {
  private oauthClient;
  private clientId = process.env.FACEBOOK_CLIENT_ID;
  private clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
  private redirectUri = process.env.FACEBOOK_REDIRECT_URI;
  // Örn: http://localhost:3000/auth/facebook/callback

  constructor() {
    const config: ModuleOptions = {
      client: {
        id: this.clientId,
        secret: this.clientSecret,
      },
      auth: {
        tokenHost: 'https://graph.facebook.com',
        tokenPath: '/v15.0/oauth/access_token',
        authorizePath: '/v15.0/dialog/oauth',
      },
      options: {
        authorizationMethod: 'body',
      },
    };
    this.oauthClient = create(config);
  }

  getAuthorizationUrl(): string {
    const authorizationUri = this.oauthClient.authorizeURL({
      redirect_uri: this.redirectUri,
      scope: 'email,public_profile',
      // state, response_type vb. ekleyebilirsiniz
    });
    return authorizationUri;
  }

  async getAccessToken(code: string) {
    const tokenParams = {
      code,
      redirect_uri: this.redirectUri,
      scope: 'email,public_profile',
    };
    const result = await this.oauthClient.getToken(tokenParams);
    return result.token.access_token;
  }

  async getUserProfile(accessToken: string) {
    // Facebook Graph API ile kullanıcı bilgilerini çekin
    // https://graph.facebook.com/me?fields=id,name,email&access_token=xxx
    const fields = 'id,name,email';
    const url = `https://graph.facebook.com/me?fields=${fields}&access_token=${accessToken}`;
    const response = await axios.get(url);
    return response.data; // { id, name, email }
  }
}
