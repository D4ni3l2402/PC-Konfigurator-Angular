import { Component, OnInit } from '@angular/core';
import { ShoppingcartDataService } from '../shoppingcart-data.service';
import { KonfiguratorDataService } from '../konfigurator-data.service';
import { OrderService } from '../order.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.scss']
})
export class ShoppingcartComponent implements OnInit {

  discountcode: string = '';
  couponMessage: string = '';
  couponMessageType: 'success' | 'error' | '' = '';
  couponApplied: boolean = false;

  usernr: number;
  shoppingCartItems: any[] = [];
  serverItems: any[] = [];
  donePcItems: any[] = [];
  regularItems: any[] = [];
  totalAmount: number = 0.0;
  isModalOpen: boolean = false;
  changableList: any[] = ["ram", "speicher", "os"];

  itemsList: any[] = [];
  ramList: any[] = [];
  speicherList: any[] = [];
  osList: any[] = [];
  clicked: any[] = [];
  selRam: any;
  selSpeicher: any;
  selOS: any;
  newPrice: number;

  isDiscounted: boolean;
  getDiscountPercen: any;

  getDiscountSave: number = 0;

  missingItems: boolean = false;



  klicked: any;
  constructor(private shoppingcartService: ShoppingcartDataService, private orderService: OrderService, private authService: AuthService, private konfiguratorDataService: KonfiguratorDataService, private router: Router) {
    this.konfiguratorDataService.getItems().subscribe(data => {
      this.itemsList = data;
      this.ramList = this.itemsList.filter(item => item.typeof == "RAM");
      this.speicherList = this.itemsList.filter(item => item.typeof == "SPEICHER");
      this.osList = this.itemsList.filter(item => item.typeof == "BETRIEBSSYSTEM");
    });
  }

  ngOnInit(): void {

    this.usernr = this.authService.userDetails.usernr;
    this.shoppingcartService.cartItems$.subscribe(items => {
      this.shoppingCartItems = items;
    });

    this.shoppingcartService.getServerItems(this.usernr).subscribe(data => {
      this.serverItems = data;
      this.containsDonePc();
      this.calculateTotalAmount();

    });
  }

  clickeditem(item: any) {
    this.klicked = item;
    this.isModalOpen = true;
    console.log(this.klicked.namepc);
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

  typeOf(type: any): void {
    const changable = document.querySelector(".itemList") as HTMLElement;

    for (const element of this.changableList) {
      const asd = document.querySelector(`.${element}`) as HTMLElement;
      if (element == type) {
        asd.classList.toggle("clicked");
      }
    }
  }

  clickedItem(item: any) {

    if (item.typeof == 'RAM') {
      this.selRam = item;
    }
    else if (item.typeof == 'SPEICHER') {
      this.selSpeicher = item;
    }
    else if (item.typeof == 'BETRIEBSSYSTEM') {
      this.selOS = item;
    }
    this.updatePrice();
  }

  updatePrice(): void {
    // Setze den neuen Preis auf den ursprünglichen PC-Preis
    this.newPrice = this.klicked.pcprice;
    // Überprüfe und aktualisiere den Preis basierend auf dem ausgewählten RAM
    if (this.selRam != null) {
      for (const element of this.ramList) {
        if (element.name == this.klicked.nram) {
          this.newPrice -= element.price; // Subtrahiere den Preis des aktuellen RAMs
          this.newPrice += parseFloat(this.selRam.price); // Addiere den Preis des ausgewählten RAMs
        }
      }
    }

    // Überprüfe und aktualisiere den Preis basierend auf dem ausgewählten Speicher
    if (this.selSpeicher != null) {
      for (const element of this.speicherList) {
        if (element.name == this.klicked.nspeicher) {
          this.newPrice -= element.price; // Subtrahiere den Preis des aktuellen Speichers
          this.newPrice += parseFloat(this.selSpeicher.price); // Addiere den Preis des ausgewählten Speichers
        }
      }
    }

    // Überprüfe und aktualisiere den Preis basierend auf dem ausgewählten Betriebssystem
    if (this.selOS != null) {
      for (const element of this.osList) {
        if (element.name == this.klicked.nos) {
          this.newPrice -= element.price; // Subtrahiere den Preis des aktuellen Betriebssystems
          this.newPrice += parseFloat(this.selOS.price); // Addiere den Preis des ausgewählten Betriebssystems
        }
      }
    }
  }


  navigateToKonfigurator(): any {
    this.router.navigate(["/konfigurator"])
  }

  updatePC(): any {
    if (this.klicked) {

      let setRam = null;
      let setSpeicher = null;
      let setOS = null;
      let setPrice = this.newPrice;
      if (this.selRam) {
        setRam = this.selRam.name;
      }
      if (this.selSpeicher) {
        setSpeicher = this.selSpeicher.name;
      }
      if (this.selOS) {
        setOS = this.selOS.name;
      }

      this.orderService.changeCurrentPc(this.klicked.pcid, this.klicked.shopcartid, this.newPrice, setRam, setSpeicher, setOS).subscribe(
        response => {
          console.log(response.message);
        },
        error => {
          console.log("Error!");
        }
      );
    }
  }

  applyCoupon() {
    // Check if a coupon has already been applied
    if (this.couponApplied) {
      this.couponMessage = "A coupon has already been applied to this order.";
      this.couponMessageType = 'error';

      // Clear the message after 10 seconds
      setTimeout(() => {
        this.couponMessage = '';
        this.couponMessageType = '';
      }, 10000);

      return; // to avoid continuing aplying the coupon again
    }

    this.shoppingcartService.applyCoupon(this.discountcode).subscribe({
      next: (response) => {
        // Assuming the response includes a discount amount or a new total
        console.log('Coupon response:', response);
        if (response.discountpercent) {// in case of sucesful check, the discount response has this
          if (response.discountpercent) {
            // If the response includes a specific discount amount
            // this.totalAmount *= (1 - response.discountpercent / 100); //short and better query( so for 10 we get 1-0.1 = 0.9 then times old total and thats the ansewer )
            // this.totalAmount -= (this.totalAmount * (1- response.discounpercentage));
            console.log('the new total amount is : ', this.totalAmount);
            this.getDiscountSave = response.discountid;
            // console.log(response.discountid);
            this.getDiscountPercen = response.discountpercent;
            this.isDiscounted = true;
            this.couponMessage = "Coupon erfolgreich eingeloest!";
            //this.couponMessage = response.error.message; // hard written feedback to user, as there is no message when it is successful
            this.couponMessageType = 'success';
            // Reset the input field
            this.discountcode = '';
            console.log(this.getDiscountSave);
            this.couponApplied = true; // Set the flag to true since a coupon has been successfully applied

          } else if (response.newTotal) {
            // If the response includes a new total amount
            this.totalAmount = response.newTotal;
          }
        } else {
          // Handle invalid coupon case
          console.error('errorira:', response.message);
          this.couponMessage = response.error.message;
          this.couponMessageType = 'error';
        }

        // Clear the message after 10 seconds
        setTimeout(() => {
          this.couponMessage = '';
          this.couponMessageType = '';
        }, 10000);

      },

      error: (error) => {
        console.error('Error applying coupon:', error);
        // Handling any errors, e.g., show an error message
        this.couponMessage = error.error.message;
        this.couponMessageType = 'error';

        // Clear the message after 10 seconds
        setTimeout(() => {
          this.couponMessage = '';
          this.couponMessageType = '';
        }, 10000);

      }
    });
  }
  //end new



  calculateTotalAmount(): void {

    // this.totalAmount = this.shoppingCartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
    for (const element of this.donePcItems) {
      this.totalAmount += parseFloat(element.price); // Fügen Sie den Preis des aktuellen Elements zu totalAmount hinzu
    }

    for (const element of this.regularItems) {
      this.totalAmount += parseFloat(element.price); // Fügen Sie den Preis des aktuellen Elements zu totalAmount hinzu
    }

    // Optional: Runden Sie die Gesamtsumme auf zwei Dezimalstellen
    this.totalAmount = parseFloat(this.totalAmount.toFixed(2));
  }

  checkUser(): void {
    this.orderService.deleteCurrentOder().subscribe(
      response => {
        console.log("Item gelöscht!");
      },
      error => {
        console.error("Error beim löschen!");
      }
    )
  }

  deleteCartItems(): void {

    this.orderService.deleteCartItems().subscribe(
      response => {
        console.log(response.message);
      },
      error => {
        console.log("Error!");
      }
    )
    location.reload()
  }

  checkAllItems(items: any[]): void {
    const requiredTypes = new Set([
      'CPU', 'GPU', 'RAM', 'MAINBOARD', 'SPEICHER', 'GEHAEUSE',
      'KUEHLER', 'NETZTEIL',
    ]);

    const existingTypes = new Set(items.map(item => item.typeof));

    for (const type of requiredTypes) {
      if (!existingTypes.has(type)) {
        console.log(`Das Element mit dem Typ ${type} fehlt im Einkaufswagen.`);
        console.log('Der Kaufvorgang wird abgebrochen.');
        this.missingItems = true;
        throw new Error(`Das Element mit dem Typ ${type} fehlt im Einkaufswagen.`);
      }
    }
    console.log('Alle erforderlichen Elemente sind im Einkaufswagen vorhanden. Der Kaufvorgang wird fortgesetzt.');
  }

  cartItems: any[] = [];
  pcItems: any[] = [];

  completePurchase(): void {
    // Hier wird die Bestellung zum Server gesendet

    

    for (const element of this.regularItems) {
      this.cartItems.push(element);
    }

    for (const element of this.donePcItems) {
      this.pcItems.push(element);
    }

    if (this.cartItems.length > 0 || this.pcItems.length > 0) {

      this.checkAllItems(this.cartItems)


      let putDiscount = 0;

      if (this.getDiscountSave !== 0) {
        putDiscount = this.getDiscountSave;
      }
      else {
        putDiscount = 0;
      }

      this.orderService.placeOrder(this.cartItems, this.pcItems, this.getDiscountSave).subscribe(
        response => {
          console.log(response.message);
          // Hier könntest du eine Erfolgsmeldung anzeigen oder den Benutzer weiterleiten
        },
        error => {
          console.error('Fehler beim Aufgeben der Bestellung:', error);
          // Hier könntest du eine Fehlermeldung für den Benutzer anzeigen
        }
      );

      this.orderService.deleteCurrentOder().subscribe(
        response => {
          console.log("Item gelöscht!");
        },
        error => {
          console.error("Error beim löschen!");
        }
      )

      this.router.navigate(["/account"])
    }

  }


  containsDonePc(): void {
    for (const element of this.serverItems) {
      if (element.pcid != null) {
        this.donePcItems.push(element);
      } else {
        this.regularItems.push(element);
      }
    }
  }

}
