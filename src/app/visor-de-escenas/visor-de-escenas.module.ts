import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisorDeEscenasPageRoutingModule } from './visor-de-escenas-routing.module';

import { VisorDeEscenasPage } from './visor-de-escenas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisorDeEscenasPageRoutingModule
  ],
  declarations: [VisorDeEscenasPage]
})
export class VisorDeEscenasPageModule {}
