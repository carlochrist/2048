import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  animations: [
    trigger(
      'zoomIn', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0, }),
        animate('300ms', style({ transform: 'scale(1)', opacity: 1, }))
      ]),
    ]
    )
  ],
  // animations: [
  //   // fadeIn, zoomIn
  //   zoomIn
  //   // trigger("myTrigger", [
  //   //   // state(
  //   //   //   "popOverState",
  //   //   //   style({
  //   //   //     opacity: "1"
  //   //   //   })
  //   //   // ),
  //   //   // transition("void => *", [
  //   //   //   style({ opacity: "0", transform: "translateX(20px)" }),
  //   //   //   animate("500ms")
  //   //   // ])
  //   //   state('move', style({
  //   //     transform: 'translateX(-100%)',
  //   //   })),
  //   //   transition('* => *', animate('500ms ease')),
  //   // ])
})
export class BlockComponent {

  @Input() value: string = '';
  @Input() zoom: boolean = false;

  // @Input() newRndNumber: boolean = false;

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
