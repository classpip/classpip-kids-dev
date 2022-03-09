import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisJuegosPageRoutingModule } from './mis-juegos-routing.module';

import { MisJuegosPage } from './mis-juegos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisJuegosPageRoutingModule
  ],
  declarations: [MisJuegosPage]
})
export class MisJuegosPageModule {}
