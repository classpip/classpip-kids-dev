import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuentosAEspiarPageRoutingModule } from './cuentos-a-espiar-routing.module';

import { CuentosAEspiarPage } from './cuentos-a-espiar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CuentosAEspiarPageRoutingModule
  ],
  declarations: [CuentosAEspiarPage]
})
export class CuentosAEspiarPageModule {}
