import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InstruccionesMemoramaPageRoutingModule } from './instrucciones-memorama-routing.module';

import { InstruccionesMemoramaPage } from './instrucciones-memorama.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InstruccionesMemoramaPageRoutingModule
  ],
  declarations: [InstruccionesMemoramaPage]
})
export class InstruccionesMemoramaPageModule {}
