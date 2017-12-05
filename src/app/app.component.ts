import {Component} from '@angular/core';
import {OverlayContainer} from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(private overlayContainer: OverlayContainer) {
  }

  private _isDark = false;

  get isDark() {
    return this._isDark;
  }

  set isDark(value: boolean) {
    this._isDark = value;
    if (this._isDark) {
      this.overlayContainer.getContainerElement().classList.add('dark-theme');
    } else {
      this.overlayContainer.getContainerElement().classList.remove('dark-theme');
    }
  }
}
