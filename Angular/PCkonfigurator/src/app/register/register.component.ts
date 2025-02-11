import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user = {
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  //private apiUrl = 'http://localhost:3300/';
  registrationError: string = ''; 

  register() {
    this.authService.register(this.user).subscribe({
      next: (response: any) => {
        console.log('Registration successful:', response);
        this.authService.setAuthenticated(true);
        this.authService.currentUser = this.user.userName;
        sessionStorage.setItem('currentUser', this.user.userName);
        this.authService.getUserDetails(this.user.userName).subscribe({
          next: (userDetails: any) => {
            console.log('User details:', userDetails);

            // Speichere zusätzliche Benutzerinformationen
            this.authService.setUserDetails(userDetails);

            // Weiterleitung zur geschützten Seite
            //tru seten
            this.router.navigate(['/start']);

          },
          error: (error: any) => {
            console.error('Error fetching user details:', error);
            // Handle Fehler, zeige Fehlermeldung an usw.
          }
        });
      },
      error: (error: any) => {
        console.error('Registration failed:', error);
        console.log("FEHLER!!!!!");
        this.registrationError = error.error.error; // Annahme: Der Server gibt die Fehlermeldung im 'error' Objekt zurück
      }
    });
  }
}