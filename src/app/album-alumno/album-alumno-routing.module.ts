import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlbumAlumnoPage } from './album-alumno.page';

const routes: Routes = [
  {
    path: '',
    component: AlbumAlumnoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlbumAlumnoPageRoutingModule {}
