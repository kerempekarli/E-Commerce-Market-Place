import { Injectable } from '@nestjs/common';
import { AuthorizationCode, ModuleOptions } from 'simple-oauth2';
import axios from 'axios';

@Injectable()
export class FacebookAuthService {
  private oauthClient: AuthorizationCode;
  private clientId = process.env.FACEBOOK_CLIENT_ID;
  private clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
  private redirectUri = process.env.FACEBOOK_REDIRECT_URI;

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
    };

    // AuthorizationCode nesnesi oluşturuluyor
    this.oauthClient = new AuthorizationCode(config);
  }

  getAuthorizationUrl(): string {
    const authorizationUri = this.oauthClient.authorizeURL({
      redirect_uri: this.redirectUri,
      scope: 'email,public_profile',
    });
    return authorizationUri;
  }

  async getAccessToken(code: string) {
    const tokenParams = {
      code,
      redirect_uri: this.redirectUri,
    };

    const accessTokenResponse = await this.oauthClient.getToken(tokenParams);
    return accessTokenResponse.token.access_token;
  }

  async getUserProfile(accessToken: string) {
    const fields = 'id,name,email';
    const url = `https://graph.facebook.com/me?fields=${fields}&access_token=${accessToken}`;
    const response = await axios.get(url);
    return response.data; // { id, name, email }
  }
}
