import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisJuegosPage } from './mis-juegos.page';

const routes: Routes = [
  {
    path: '',
    component: MisJuegosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisJuegosPageRoutingModule {}
