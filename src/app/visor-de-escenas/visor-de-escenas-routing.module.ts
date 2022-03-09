import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisorDeEscenasPage } from './visor-de-escenas.page';

const routes: Routes = [
  {
    path: '',
    component: VisorDeEscenasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisorDeEscenasPageRoutingModule {}
