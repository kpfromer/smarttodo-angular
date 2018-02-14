import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AuthGuard} from './shared/auth-guard.service';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {path: '', loadChildren: './public/public.module#PublicModule'},
      {path: '', loadChildren: './secure/secure.module#SecureModule', canLoad: [AuthGuard]},
      {path: '**', component: PageNotFoundComponent}
    ])
  ],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
