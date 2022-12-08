import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemoramagamePageRoutingModule } from './memoramagame-routing.module';

import { MemoramagamePage } from './memoramagame.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemoramagamePageRoutingModule
  ],
  declarations: [MemoramagamePage]
})
export class MemoramagamePageModule {}
