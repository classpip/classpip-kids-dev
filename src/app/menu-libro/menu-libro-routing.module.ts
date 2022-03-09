import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuLibroPage } from './menu-libro.page';

const routes: Routes = [
  {
    path: '',
    component: MenuLibroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuLibroPageRoutingModule {}
