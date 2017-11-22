import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AuthService} from './shared/auth.service';
import {WebStorageModule} from 'ngx-store';
import {JwtModule} from '@auth0/angular-jwt';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {DefaultInterceptor} from './shared/default.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('id_token');
        }
      }
    }),
    WebStorageModule,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    {provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
