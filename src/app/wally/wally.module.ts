import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WallyPageRoutingModule } from './wally-routing.module';

import { WallyPage } from './wally.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WallyPageRoutingModule
  ],
  declarations: [WallyPage]
})
export class WallyPageModule {}
