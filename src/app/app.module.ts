import { NgModule } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { BlockComponent } from './block/block.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import * as Hammer from 'hammerjs';


export class MyHammerConfig extends HammerGestureConfig {
  override overrides = <any>{
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    BlockComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HammerModule
  ],
  providers: [{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: MyHammerConfig,
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
