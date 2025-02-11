import { CanActivateFn } from '@angular/router';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';


export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']); // Weiterleitung zum Login, wenn nicht angemeldet
      return false;
    }
  }
}