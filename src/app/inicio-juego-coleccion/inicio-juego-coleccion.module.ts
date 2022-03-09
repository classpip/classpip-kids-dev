import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioJuegoColeccionPageRoutingModule } from './inicio-juego-coleccion-routing.module';

import { InicioJuegoColeccionPage } from './inicio-juego-coleccion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioJuegoColeccionPageRoutingModule
  ],
  declarations: [InicioJuegoColeccionPage]
})
export class InicioJuegoColeccionPageModule {}
