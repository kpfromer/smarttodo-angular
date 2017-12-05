import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AuthService} from './shared/auth.service';
import {JwtModule} from '@auth0/angular-jwt';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {DefaultInterceptor} from './shared/default.interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatIconModule, MatMenuModule, MatSidenavModule, MatSnackBarModule, MatToolbarModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('id_token');
        }
      }
    }),
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
