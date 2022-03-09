import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstruccionesMemoramaPage } from './instrucciones-memorama.page';

const routes: Routes = [
  {
    path: '',
    component: InstruccionesMemoramaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstruccionesMemoramaPageRoutingModule {}
