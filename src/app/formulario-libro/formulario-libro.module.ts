import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormularioLibroPageRoutingModule } from './formulario-libro-routing.module';

import { FormularioLibroPage } from './formulario-libro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormularioLibroPageRoutingModule
  ],
  declarations: [FormularioLibroPage]
})
export class FormularioLibroPageModule {}
