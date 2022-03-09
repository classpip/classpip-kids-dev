import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuLibroPageRoutingModule } from './menu-libro-routing.module';

import { MenuLibroPage } from './menu-libro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuLibroPageRoutingModule
  ],
  declarations: [MenuLibroPage]
})
export class MenuLibroPageModule {}
