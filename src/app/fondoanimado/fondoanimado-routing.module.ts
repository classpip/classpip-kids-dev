import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FondoanimadoPage } from './fondoanimado.page';

const routes: Routes = [
  {
    path: '',
    component: FondoanimadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FondoanimadoPageRoutingModule {}
