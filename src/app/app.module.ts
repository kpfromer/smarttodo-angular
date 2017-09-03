import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AuthModule} from './shared/auth/auth.module';
import {fakeBackendFactory} from './helpers/fake.backend';
import {MockBackend} from '@angular/http/testing';
import {BaseRequestOptions, Http, HttpModule, XHRBackend} from '@angular/http';
import {environment} from '../environments/environment';
import {AuthService} from './shared/auth.service';
import {realBackendFactory} from './helpers/real.backend';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AuthModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [

    environment.production ? {
      provide: Http,
      useFactory: realBackendFactory,
      deps: [XHRBackend, BaseRequestOptions]
    } : {
      provide: Http,
      useFactory: fakeBackendFactory,
      deps: [MockBackend, BaseRequestOptions]
    },
    XHRBackend,
    MockBackend,
    BaseRequestOptions,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
