import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemoramagamePage } from './memoramagame.page';

const routes: Routes = [
  {
    path: '',
    component: MemoramagamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemoramagamePageRoutingModule {}
