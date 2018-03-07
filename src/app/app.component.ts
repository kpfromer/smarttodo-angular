import {Component} from '@angular/core';
import {OverlayContainer} from '@angular/cdk/overlay';
import {AuthService} from './shared/auth.service';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(private overlayContainer: OverlayContainer,
              public authService: AuthService,
              private snackBar: MatSnackBar,
              private router: Router) {
  }

  private _isDark = false;

  get isDark() {
    return this._isDark;
  }

  logout() {
    if (this.authService.logout()) {
      this.router.navigateByUrl('/home');
      this.snackBar.open('Successfully Logged Out', 'DISMISS', {
        duration: 3500
      });
    } else {
      const snackbar = this.snackBar.open('Failed to Logout', 'RETRY', {
        duration: 3500
      });
      snackbar.onAction().subscribe(() => {
        this.logout();
      });
    }
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
