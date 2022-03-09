import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WallyPage } from './wally.page';

const routes: Routes = [
  {
    path: '',
    component: WallyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WallyPageRoutingModule {}
