import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnEjemploPage } from './un-ejemplo.page';

const routes: Routes = [
  {
    path: '',
    component: UnEjemploPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnEjemploPageRoutingModule {}
