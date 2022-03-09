import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioJuegoPuntosPageRoutingModule } from './inicio-juego-puntos-routing.module';

import { InicioJuegoPuntosPage } from './inicio-juego-puntos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioJuegoPuntosPageRoutingModule
  ],
  declarations: [InicioJuegoPuntosPage]
})
export class InicioJuegoPuntosPageModule {}
