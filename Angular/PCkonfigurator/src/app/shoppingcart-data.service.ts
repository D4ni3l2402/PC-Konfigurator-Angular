import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingcartDataService {

  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable(); 
  private apiUrl = 'http://localhost:3300';

  public itemAlreadyExist:boolean;

  constructor(private http: HttpClient, private authService: AuthService) {}

  addToCart(cartItem: any): any {
    const currentItems = this.cartItemsSubject.value;

    // Überprüfen, ob das Element bereits im Warenkorb ist (anhand einer eindeutigen ID)
    const existingItem = currentItems.find(item => cartItem.itemsnr === item.itemsnr);
    const existingItemType = currentItems.find(item => cartItem.typeof === item.typeof);

    console.log("asd")

    console.log("1" + existingItem);
    console.log("2" + existingItemType);


    if (!existingItem) {
      const updatedItems = [...currentItems, cartItem];
      this.cartItemsSubject.next(updatedItems);
    } else {
      this.itemAlreadyExist = true;
      console.warn('Item already in cart:', cartItem);
      console.log("asddd" + this.itemAlreadyExist);
    }

    if(!existingItemType){
      const updatedItems = [...currentItems, cartItem];
      this.cartItemsSubject.next(updatedItems);
    } else {
      console.log("asd" + this.itemAlreadyExist);
      console.log("Du hast bereits eine " + cartItem.name + " in deinem Korb");
    }
    // const userId = this.authService.userDetails.usernr;
    // const body = { userId, cartItem };
    // return this.http.post(`${this.apiUrl}/account`, body);
  }

  getCartItems(): any[] {
    return this.cartItemsSubject.value;
  }

  getServerItems(userNr: any): any{
    return this.http.get(`http://localhost:3300/account/${userNr}`);
  }

// coupons code to send to the backend

applyCoupon(discountCode: string): Observable<any> {
  // Construct the URL with the discount code as a URL parameter
  const url = `http://localhost:3300/discounts/${discountCode}`;
  // Make a GET request to the URL
  return this.http.get(url);
}


}