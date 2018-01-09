import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  notValidUser = false;

  constructor(private loginService: AuthService,
              private router: Router,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar) {
  }

  openSnackBar(message: string, action: string) {
    return this.snackBar.open(message, action, {
      duration: 3500,
    });
  }

  login() {
    if (!this.loginForm.valid)
      return false;

    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    this.loginService.login(username, password).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.notValidUser = false;
        this.router.navigateByUrl('/todo');
      } else {
        this.loginForm.get('username').setErrors(null);
        this.loginForm.get('password').reset();
        this.loginForm.get('password').setErrors({required: true});
        this.notValidUser = true;
      }
    }, () => {
      this.openSnackBar('Failed to connect to server', 'DISMISS');
    });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

}
