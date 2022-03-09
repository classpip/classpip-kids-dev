import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisGruposPageRoutingModule } from './mis-grupos-routing.module';

import { MisGruposPage } from './mis-grupos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisGruposPageRoutingModule
  ],
  declarations: [MisGruposPage]
})
export class MisGruposPageModule {}
