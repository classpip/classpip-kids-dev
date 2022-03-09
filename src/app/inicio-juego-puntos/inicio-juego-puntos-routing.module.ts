import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioJuegoPuntosPage } from './inicio-juego-puntos.page';

const routes: Routes = [
  {
    path: '',
    component: InicioJuegoPuntosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioJuegoPuntosPageRoutingModule {}
