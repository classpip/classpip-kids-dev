import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlbumAlumnoPageRoutingModule } from './album-alumno-routing.module';

import { AlbumAlumnoPage } from './album-alumno.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlbumAlumnoPageRoutingModule
  ],
  declarations: [AlbumAlumnoPage]
})
export class AlbumAlumnoPageModule {}
