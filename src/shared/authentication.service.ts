import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { User } from './user';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  userData: any;
  formPasswordReset: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]]
  });
  private authEvent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public authEvent$: Observable<boolean> = this.authEvent.asObservable();

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    private formBuilder: FormBuilder
  ) {
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.authEvent.next(user.emailVerified);
        this.userData = user;
        console.log('user.emailVerified', user.emailVerified);
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        this.authEvent.next(false);
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Login in with email/password
  signIn(email, password) {
    return this.ngFireAuth.auth.signInWithEmailAndPassword(email, password);
  }

  // Register user with email/password
  registerUser(email, password) {
    return this.ngFireAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  // Email verification when new user register
  sendVerificationMail() {
    return this.ngFireAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        this.router.navigate(['verify-email']);
      });
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false) ? true : false;
  }

  // Store user in localStorage
  setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    return userRef.set(userData, {
      merge: true
    });
  }

  // Sign-out
  signOut() {
    return this.ngFireAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
      // this.authEvent.next(false);
    });
  }

  passwordReset(): void {
    const email = this.formPasswordReset.controls['email'].value;

    this.ngFireAuth.auth.sendPasswordResetEmail(email).then(
      () => {
        // success, show some message
      },
      err => {
        // handle errors
      }
    );
  }
}
