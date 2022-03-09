import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PruebamemoramaPageRoutingModule } from './pruebamemorama-routing.module';

import { PruebamemoramaPage } from './pruebamemorama.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PruebamemoramaPageRoutingModule
  ],
  declarations: [PruebamemoramaPage]
})
export class PruebamemoramaPageModule {}
