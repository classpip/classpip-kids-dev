import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemoramaColeccionPage } from './memorama-coleccion.page';

const routes: Routes = [
  {
    path: '',
    component: MemoramaColeccionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemoramaColeccionPageRoutingModule {}
