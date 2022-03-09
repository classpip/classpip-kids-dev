import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EjemploimplementacionPageRoutingModule } from './ejemploimplementacion-routing.module';

import { EjemploimplementacionPage } from './ejemploimplementacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EjemploimplementacionPageRoutingModule
  ],
  declarations: [EjemploimplementacionPage]
})
export class EjemploimplementacionPageModule {}
