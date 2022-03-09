import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FondoanimadoPageRoutingModule } from './fondoanimado-routing.module';

import { FondoanimadoPage } from './fondoanimado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FondoanimadoPageRoutingModule
  ],
  declarations: [FondoanimadoPage]
})
export class FondoanimadoPageModule {}
