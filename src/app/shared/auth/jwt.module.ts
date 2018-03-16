import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {JwtInterceptor} from './jwt.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtService} from './jwt.service';
import {JWT_OPTIONS} from './jwtoptions.token';

export interface JwtModuleOptions {
  config?: {
    tokenGetter?: () => string | Promise<string>;
    headerName?: string;
    authScheme?: string;
    throwNoTokenError?: boolean;
    skipWhenExpired?: boolean;
  };
}

@NgModule()
export class JwtModule {
  constructor(@Optional() @SkipSelf() parentModule: JwtModule) {
    if (parentModule) {
      throw new Error('JwtModule is already loaded. It should only be imported in your application\'s main module.');
    }
  }

  static forRoot(options?: JwtModuleOptions): ModuleWithProviders {
    const config: JwtModuleOptions = {
      config: {
        tokenGetter: options.config.tokenGetter || (() => localStorage.getItem('id_token')),
        headerName: options.config.headerName || 'Authorization',
        authScheme:
          options.config.authScheme || options.config.authScheme === ''
            ? options.config.authScheme
            : 'Bearer ',
        throwNoTokenError: options.config.throwNoTokenError || false,
        skipWhenExpired: options.config.skipWhenExpired || true
      }
    };

    return {
      ngModule: JwtModule,
      providers: [
        {
          provide: JWT_OPTIONS,
          useValue: config.config
        },
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        JwtService
      ]
    };
  }
}

// Modified version of @auth0's angular2-jwt
// See https://github.com/auth0/angular2-jwt
// Removed whitelist functionality due to the conflict with base interceptor appending a url
