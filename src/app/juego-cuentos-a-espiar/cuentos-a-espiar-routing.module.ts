import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuentosAEspiarPage } from './cuentos-a-espiar.page';

const routes: Routes = [
  {
    path: '',
    component: CuentosAEspiarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuentosAEspiarPageRoutingModule {}
