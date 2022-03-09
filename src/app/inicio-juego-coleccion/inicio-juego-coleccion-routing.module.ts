import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioJuegoColeccionPage } from './inicio-juego-coleccion.page';

const routes: Routes = [
  {
    path: '',
    component: InicioJuegoColeccionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioJuegoColeccionPageRoutingModule {}
