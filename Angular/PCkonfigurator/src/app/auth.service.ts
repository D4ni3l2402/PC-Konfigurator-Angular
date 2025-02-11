import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StartseiteComponent } from './startseite/startseite.component';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private getData: any;
  currentUser: any;
  userDetails: any;
  currentUserData: any | null;
  notifyLogIn: boolean = false;
  notifyLogOut: boolean = false;
  isLogout: boolean = false;

  private apiUrl = 'http://localhost:3300';

  constructor(private http: HttpClient) {
    const storedUserDetails = sessionStorage.getItem('userDetails');
    if (storedUserDetails) {
      this.userDetails = JSON.parse(storedUserDetails);
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
    // this.setAuthenticated(true);
  }

  login(userData: any): Observable<any> {
    this.setNotifyIn(true);
    this.setNotifyOut(false);
    return this.http.post(`${this.apiUrl}/login`, userData);
  }

setAuthenticated(value: boolean): void {
  sessionStorage.setItem('authenticated', value ? 'true' : 'false');
}

isLoggedIn(): boolean {
  return sessionStorage.getItem('authenticated') === 'true';
}

getCurrentUser(): any | null {
  return sessionStorage.getItem('currentUser');
}

getUserDetails(userName: string): Observable < any > {
  return this.http.get(`${this.apiUrl}/userDetails/${userName}`);
}

setUserDetails(userDetails: any): void {
  this.userDetails = userDetails;

  // Speichere die Benutzerdetails in der sessionStorage
  sessionStorage.setItem('userDetails', JSON.stringify(userDetails));
}

getAllUserData(): Observable < any > {
  return this.http.get(`${this.apiUrl}/users`);
}

setNotifyIn(currentNotify: boolean): void {
  this.notifyLogIn = currentNotify;
}

setNotifyOut(currentNotify: boolean): void {
  this.notifyLogOut = currentNotify;
}

getNotifyIn() : boolean {
  return this.notifyLogIn;
}

getNotifyOut() : boolean {
  return this.notifyLogOut;
}

logout(): void {
  this.isAuthenticated = false;
  this.setNotifyIn(false);
  this.setNotifyOut(true);
  sessionStorage.removeItem('authenticated');
  sessionStorage.removeItem('currentUser');
  sessionStorage.removeItem('userDetails');
}
}