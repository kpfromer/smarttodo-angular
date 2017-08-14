import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {PublicComponent} from './public.component';
import {HomeModule} from './home/home.module';

export function exportHomeModule() {
  return HomeModule;
}

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PublicComponent,
        children: [
          {path: '', redirectTo: 'home', pathMatch: 'full'},
          {path: 'home', loadChildren: exportHomeModule}
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class PublicRoutingModule {
}
