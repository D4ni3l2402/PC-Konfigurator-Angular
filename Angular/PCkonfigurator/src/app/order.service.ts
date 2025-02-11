import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:3300'; // Replace with your server URL

  constructor(private http: HttpClient, private authService: AuthService) { }

  // submitOrder(userId: number, cartItems: any[]): Observable<any> {
  //   const orderData = { userId, cartItems };
  //   return this.http.post(${this.apiUrl}/submitOrder, orderData);
  // }

  placeOrder(itemsList: any[] = [], donePCList: any[] = [], discountID): Observable<any> {
    const userNr = this.authService.userDetails.usernr;
    console.log(userNr);
    
    const body = { userNr, itemsList,  donePCList, discountID};
    return this.http.post(`${this.apiUrl}/orderedItems`, body);
  }

  placeOrderPC(cartItems: any[]): Observable<any> {
    const userId = this.authService.userDetails.usernr;
    
    const body = { userId, cartItems };
    return this.http.post(`${this.apiUrl}/orderedPC`, body);
  }

  //die Bestellhistorie wird angezeigt
  showOrders(): Observable<any> {
    const userId = this.authService.userDetails.usernr;
    // Entferne die params-Option und füge userId zur URL hinzu
    return this.http.get(`${this.apiUrl}/ordered/${userId}`);
  }

  placeCurrentOrder(cartItem: any, pcid: any, pcprice: any, ram: any, speicher: any, os: any): any {
    const userId = this.authService.userDetails.usernr;
    const body = { userId, cartItem, pcid, pcprice, ram, speicher, os };
    return this.http.post(`${this.apiUrl}/account`, body);
  }

  changeCurrentOrder(cartItem: any, typeOf: any, pcprice: any): any {
    const userId = this.authService.userDetails.usernr;
    const body = { userId, cartItem, typeOf, pcprice};
    return this.http.post(`${this.apiUrl}/account/changeCart`, body);
    
  }

  changeCurrentPc(pcid: any, shopcartid: any, pcprice: any, ram: any, speicher: any, os: any): any {
    const userId = this.authService.userDetails.usernr;
    const body = { userId, pcid, shopcartid, pcprice};
    return this.http.post(`${this.apiUrl}/account/changePcCart`, body);
    
  }

  deleteCurrentOder(): any {
    const userId = this.authService.userDetails.usernr;
    return this.http.delete(`${this.apiUrl}/account/${userId}`);
    
  }

  deleteCartItems(): any {
    const userId = this.authService.userDetails.usernr;
    return this.http.delete(`${this.apiUrl}/account/${userId}`);
  }



  getServerItems(userNr: any): any{
    return this.http.get(`http://localhost:3300/account/delShopCartItems/${userNr}`);
  }

  getUserOrderd(): Observable<any> {
    const userId = this.authService.userDetails.usernr;
    
    return this.http.get(`${this.apiUrl}/ordered/${userId}`).pipe(
      tap(response => {
        console.log('Response:', response);
      })
    );
  }
  

}
