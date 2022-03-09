import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UnEjemploPageRoutingModule } from './un-ejemplo-routing.module';

import { UnEjemploPage } from './un-ejemplo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnEjemploPageRoutingModule
  ],
  declarations: [UnEjemploPage]
})
export class UnEjemploPageModule {}
