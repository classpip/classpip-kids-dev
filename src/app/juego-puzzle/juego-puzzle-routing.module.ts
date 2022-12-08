import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JuegoPuzzlePage } from './juego-puzzle.page';

const routes: Routes = [
  {
    path: '',
    component: JuegoPuzzlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PuzzlePageRoutingModule {}
