import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemoramaColeccionPageRoutingModule } from './memorama-coleccion-routing.module';

import { MemoramaColeccionPage } from './memorama-coleccion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemoramaColeccionPageRoutingModule
  ],
  declarations: [MemoramaColeccionPage]
})
export class MemoramaColeccionPageModule {}
