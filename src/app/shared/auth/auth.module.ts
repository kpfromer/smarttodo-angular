import {NgModule} from '@angular/core';
import {AuthConfig, AuthHttp} from 'angular2-jwt';
import {Http, RequestOptions} from '@angular/http';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'id_token',
    tokenGetter: (() => sessionStorage.getItem('id_token'))
  }), http, options);
}

@NgModule({
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ]
})
export class AuthModule {
}
