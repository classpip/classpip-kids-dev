import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EjemploimplementacionPage } from './ejemploimplementacion.page';

const routes: Routes = [
  {
    path: '',
    component: EjemploimplementacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EjemploimplementacionPageRoutingModule {}
