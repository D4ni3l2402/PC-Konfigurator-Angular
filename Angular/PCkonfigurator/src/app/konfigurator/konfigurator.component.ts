import { Component, OnInit } from '@angular/core';
import { KonfiguratorDataService } from '../konfigurator-data.service';
import { ShoppingcartDataService } from '../shoppingcart-data.service';
import { OrderService } from '../order.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { response } from 'express';

@Component({
  selector: 'app-konfigurator',
  templateUrl: './konfigurator.component.html',
  styleUrls: ['./konfigurator.component.scss']
})
export class KonfiguratorComponent implements OnInit {

  isModalOpen: boolean = false;
  selectedCategory: string = '';
  selectedItems: any[] = [];
  items: any[] = [];
  clicked: any;
  itemExist: boolean;
  isLoggedIn: boolean = this.authService.isLoggedIn();

  shopCartItems: any[] = [];
  usernr: number;

  cpu: any = null;
  gpu: any;
  ram: any;
  speicher: any;
  gehaeuse: any;
  mainboard: any;
  kuehler: any;
  netzteil: any;
  laufwerk: any;
  betriebssystem: any;


  constructor(private konfiguratorDataService: KonfiguratorDataService, private shoppingcartService: ShoppingcartDataService, private orderService: OrderService, private router: Router, private authService: AuthService) {
    // this.getCpu = konfiguratorDataService.getCpuData();
    // this.getGpu = konfiguratorDataService.getGpuData();
    if(this.authService.isLoggedIn()){
      this.usernr = this.authService.userDetails.usernr;

      this.shoppingcartService.getServerItems(this.usernr).subscribe(data => {
        this.shopCartItems = data;
        // console.table(this.shopCartItems);
      })
    }
    this.konfiguratorDataService.getItems().subscribe(data => {
      this.selectedItems = data;
    });

   

  }

  ngOnInit(): void {
    setTimeout(() => {
      this.showCartItems();
    }, 200);
  }


  showModal(category: string): void {
    this.selectedCategory = category;
    this.items = this.selectedItems.filter(item => item.typeof === category && this.isBrandSelected(item));
    this.isModalOpen = true;
    this.clicked = this.items[0];
    

    // Lade die entsprechenden Daten für das ausgewählte Element
    // if(category == "CPU"){
    //   this.selectedItems = this.konfiguratorDataService.getCpuData();
    // } else if(category == "GPU"){
    //   this.selectedItems = this.konfiguratorDataService.getGpuData();
    // }
  }

  private isBrandSelected(item: any): boolean {
    const productName = item.name.toLowerCase();

    if (this.selectedCategory === 'CPU') {
      return !this.konfiguratorDataService.selectedCpuBrand ||
        productName.includes(this.konfiguratorDataService.selectedCpuBrand.toLowerCase());
    } else if (this.selectedCategory === 'GPU') {
      return !this.konfiguratorDataService.selectedGpuBrand ||
        productName.includes(this.konfiguratorDataService.selectedGpuBrand.toLowerCase());
    }

    return true;
  }

  closeModal(event: Event): void {
    const modal = document.querySelector(".modal");
    const close = document.querySelector(".close");


    if (close && close.contains(event.target as Node)) {
      // Klick auf das "X", Modal schließen
      this.isModalOpen = false;
    } else if (modal && !modal.contains(event.target as Node)) {
      // Klick außerhalb des Modals, Modal schließen
      this.isModalOpen = false;
    }
  }

  clickedItem(item: any) {
    this.clicked = item;
    console.log(this.clicked)
  }

  addToCart(): void {
    if (this.clicked) {
      // Durchlaufe die Artikel im Warenkorb
      if (this.authService.isLoggedIn()) {
        for (const element of this.shopCartItems) {
          if (this.clicked.itemsnr == element.itemsnr) {
            console.log("Du hast bereits " + this.clicked.name + " in deinem Warenkorb!");
            this.shoppingcartService.addToCart(this.clicked); //löschen maybe?
            return;
          }

          if (this.clicked.typeof == element.typeof) {
            // console.log("Du hast bereits den Typ: " + element.typeof + " in deinem Warenkorb!");
            this.updateCartItem();
            this.setTimeOut();

            this.isModalOpen = false;

            return;
          }
        }

        // Wenn der Artikel nicht im Warenkorb ist, füge ihn hinzu
        if (this.clicked.quantity > 0) {
          this.orderService.placeCurrentOrder(this.clicked.itemsnr, null, null, null, null, null).subscribe(
            response => {
              console.log(response.message);
            },
            error => {
              console.log("Error!");
            }
          );
        } else {
          console.log(`${this.clicked.name} nicht verfügbar!`);

        }

        this.setTimeOut();
        this.isModalOpen = false;
        
      } else {
        this.router.navigate(["/login"]);
      }
    }
  }

  updateCartItem(): void {
    let cartItem = this.clicked.itemsnr;
    let typeOf = this.clicked.typeof;
    let pcprice = this.clicked.price;
    

    this.orderService.changeCurrentOrder(cartItem, typeOf, pcprice).subscribe(
      response => {
        console.log(response.message);
      },
      error => {
        console.log("Item konnte nicht geupdated werden!");

      }
    )
  }

  setTimeOut(): void {
    setTimeout(() => {
      this.updateCart();
      
    }, 200);
    setTimeout(() => {
      this.showCartItems();
    }, 500);
  }

  itemAlreadyExist(): boolean {
    console.log(this.shoppingcartService.itemAlreadyExist);
    return this.itemExist = this.shoppingcartService.itemAlreadyExist;
  }

  kaufen(): void {
    // this.orderService.deleteCurrentOder().subscribe(
    //   response => {
    //     console.log("Item gelöscht!");
    //   },
    //   error => {
    //     console.log("Error beim löschen!");
    //   }
    // )
    this.router.navigate(["/cart"]);
  }

  updateCart(): void {
    this.shoppingcartService.getServerItems(this.usernr).subscribe(data => {
      this.shopCartItems = data;
      // console.table(this.shopCartItems);
    });
  }

  showCartItems(): void {
    for (const element of this.shopCartItems) {
      const typeOf = element.typeof;

      // let box = document.querySelector(`.${typeOf.toLowerCase()}`) as HTMLHtmlElement;


      if (typeOf == 'CPU') {
        this.cpu = element;
      }
      if (typeOf == 'GPU') {
        this.gpu = element;
        console.log(element);
        
      }

      if (typeOf == "RAM") {
        this.ram = element;
      }
      if (typeOf == "MAINBOARD") {
        this.mainboard = element;
      }
      if (typeOf == "SPEICHER") {
        this.speicher = element;
      }
      if (typeOf == "GEHAEUSE") {
        this.gehaeuse = element;
      }
      if (typeOf == "KUEHLER") {
        this.kuehler = element;
      }
      if (typeOf == "NETZTEIL") {
        this.netzteil = element;
      }
      if (typeOf == "LAUFWERK") {
        this.laufwerk = element;
      }
      if (typeOf == "BETRIEBSSYSTEM") {
        this.betriebssystem = element;
      }
    }
  }
}