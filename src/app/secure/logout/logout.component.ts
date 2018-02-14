import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private snackBar: MatSnackBar) {
  }

  logOut() {
    localStorage.removeItem('id_token');
    this.router.navigateByUrl('/home');
    this.snackBar.open('Successfully Logged Out', 'DISMISS', {
      duration: 3500
    });
  }

  ngOnInit() {
    this.logOut();
  }
}
