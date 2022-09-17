import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  animations: [
    trigger('popOverState', [
      state('show', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0
      })),
      transition('show => hide', animate('600ms ease-out')),
      transition('hide => show', animate('1000ms ease-in'))
    ])
  ]
})
export class BlockComponent {

  @Input() value: string = '';
  @Input() newRndNumber: boolean = false;

  constructor() { }

  getBlockColor(blockValue: string): string {
    const blockValueAsNumber = parseInt(blockValue);
    switch (blockValueAsNumber) {
      case 2:
        return '#EEE4DA';
      case 4:
        return '#EDE0C8';
      case 8:
        return '#F2B179';
      case 16:
        return '#EDCC62';
      case 32:
        return '#F67C60';
      case 64:
        return '#F65E3B';
      case 128:
        return '#EDCF73';
      case 256:
        return '#EDCC62';
      case 512:
        return '#EDC850';
      case 1024:
        return '#EDC53F';
      case 2048:
        return '#EDC22D';
      default:
        return '#C0B3A6';
    }
  }

}
