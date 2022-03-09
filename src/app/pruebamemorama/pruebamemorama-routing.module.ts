import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PruebamemoramaPage } from './pruebamemorama.page';

const routes: Routes = [
  {
    path: '',
    component: PruebamemoramaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PruebamemoramaPageRoutingModule {}
