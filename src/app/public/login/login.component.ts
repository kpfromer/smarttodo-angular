import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  notValidUser = false;

  constructor(private loginService: AuthService, private router: Router, private formBuilder: FormBuilder) {
  }

  login(username: string, password: string) {
    if (this.loginForm.invalid) return;

    this.loginForm.reset();
    this.loginForm.get('username').setErrors({});
    this.loginForm.get('password').setErrors({});

    this.loginService.login(username, password).then(isLoggedIn => {
      if (isLoggedIn) {
        this.notValidUser = false;
        this.router.navigateByUrl('/todo');
      } else {
        this.notValidUser = true;
      }
    });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

}
