import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../shared/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  emailIsVerified: boolean;


  constructor(
    public authService: AuthenticationService,
    public router: Router
  ) { }

  ngOnInit() {
    this.authService.authEvent$.subscribe(authEvent => {
      this.emailIsVerified = authEvent;
      console.log('authEvent', this.emailIsVerified);
    });
  }

  logIn(email, password) {
    this.authService.signIn(email.value, password.value)
      .then((res) => {
        if (this.emailIsVerified) {
          this.router.navigate(['news-list']);
        } else {
          window.alert('Email is not verified');
          return false;
        }
      }).catch((error) => {
      window.alert(error.message);
    });
  }


}
