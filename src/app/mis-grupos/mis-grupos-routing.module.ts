import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisGruposPage } from './mis-grupos.page';

const routes: Routes = [
  {
    path: '',
    component: MisGruposPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisGruposPageRoutingModule {}
