import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormularioLibroPage } from './formulario-libro.page';

const routes: Routes = [
  {
    path: '',
    component: FormularioLibroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormularioLibroPageRoutingModule {}
