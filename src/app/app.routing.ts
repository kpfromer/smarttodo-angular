import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {SecureModule} from './secure/secure.module';
import {PublicModule} from './public/public.module';
import {AuthGuard} from './shared/auth-guard.service';

export function exportPublicModule() {
  return PublicModule;
}

export function exportSecureModule() {
  return SecureModule;
}

@NgModule({
  imports: [
    RouterModule.forRoot([
      {path: '', loadChildren: exportPublicModule},
      {path: '', loadChildren: exportSecureModule},
      {path: '**', component: PageNotFoundComponent}
    ])
  ],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
