import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { StartseiteComponent } from '../startseite/startseite.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user = {
    userName: '',
    password: ''
    // firstname: '',
    // lastname: '',
    // email: '',
    // address: '',
    // phone: '',
  };

  loginFailed: boolean = false;
  failMessage: string;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.user).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        // Speichere Token oder andere Informationen bei Bedarf
        this.authService.setAuthenticated(true);
        this.authService.currentUser = this.user.userName;
        sessionStorage.setItem('currentUser', this.user.userName);
        this.authService.getUserDetails(this.user.userName).subscribe({
          next: (userDetails: any) => {
            console.log('User details:', userDetails);

            // Speichere zusätzliche Benutzerinformationen
            this.authService.setUserDetails(userDetails);

            // Weiterleitung zur geschützten Seite
            this.router.navigate(['/start']);

          },
          error: (error: any) => {
            console.error('Error fetching user details:', error);
            // Handle Fehler, zeige Fehlermeldung an usw.
          }
        });
      },

      error: (error: any) => {
        console.error('Login failed:', error);
        this.loginFailed = true;

        // this.failMessage = "Fehler bei der Anmeldung. Versuche es erneut!";
        // Handle Fehler, zeige Fehlermeldung an usw.
      }
    });
  }

  

}