import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  styles: [':host {display: block;}']
})
export class AppComponent {
  title = '2048';

  innerWidth = 0;

  // @HostListener('window:resize') onWindowResize() {
  //   this.innerWidth = this.getInnerWidth() – 50;
  // }

  // getInnerWidth(): number {
  //   let result = 0;

  //   if (isPlatformBrowser(this._platformId)) {
  //     result = window.innerWidth;
  //   }

  //   return result;
  // }
}
