import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PuzzlePageRoutingModule } from './juego-puzzle-routing.module';

import { JuegoPuzzlePage } from './juego-puzzle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PuzzlePageRoutingModule
  ],
  declarations: [JuegoPuzzlePage]
})
export class JuegoPuzzlePageModule {}
