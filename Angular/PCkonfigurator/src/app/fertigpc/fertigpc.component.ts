import { Component } from '@angular/core';
import { FertigePCsService } from '../fertige-pcs.service';
import { AuthService } from '../auth.service';
import { ShoppingcartDataService } from '../shoppingcart-data.service';
import { OrderService } from '../order.service';
import { KonfiguratorDataService } from '../konfigurator-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fertigpc',
  templateUrl: './fertigpc.component.html',
  styleUrls: ['./fertigpc.component.scss']
})
export class FertigpcComponent {

  isModalOpen: boolean = false;
  isListOpen: boolean = false;
  clickListener(): void {
    console.log("asd")
  }
  selectedPC: string = '';
  fertigPCsList: any[] = [];
  choosenPC: any = null;
  itemsList: any[] = [];
  ramList: any[] = [];
  speicherList: any[] = [];
  osList: any[] = [];
  clicked: any[] = [];
  selRam: any;
  selSpeicher: any;
  selOS: any;
  newPrice: number;

  changableList: any[] = ["ram", "speicher", "os"];

  constructor(private fertigePCsService: FertigePCsService, private konfiguratorDataService: KonfiguratorDataService, private orderService: OrderService, private authService: AuthService, private router: Router,) {
    this.fertigePCsService.getFeritgPC().subscribe(data => {
      this.fertigPCsList = data; console.log(this.fertigPCsList);
    });

    this.konfiguratorDataService.getItems().subscribe(data => {
      this.itemsList = data;
      this.ramList = this.itemsList.filter(item => item.typeof == "RAM");
      this.speicherList = this.itemsList.filter(item => item.typeof == "SPEICHER");
      this.osList = this.itemsList.filter(item => item.typeof == "BETRIEBSSYSTEM");
    });

  }
  showModal(selectedPC: any): void {
    this.choosenPC = selectedPC;
    this.isModalOpen = true;
  }

  closeModal(event: Event): void {
    const modal = document.querySelector(".modal");
    const close = document.querySelector(".close");

    if (close && close.contains(event.target as Node)) {
      // Klick auf das "X", Modal schließen
      this.isModalOpen = false;
      this.resetPrice();

    } else if (modal && !modal.contains(event.target as Node)) {
      // Klick außerhalb des Modals, Modal schließen
      this.isModalOpen = false;
      this.resetPrice();
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

  resetPrice(): void {
    this.selRam = null;
    this.selSpeicher = null;
    this.selOS = null;
    this.newPrice = this.choosenPC.pcprice;
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
    this.newPrice = this.choosenPC.pcprice;

    // Überprüfe und aktualisiere den Preis basierend auf dem ausgewählten RAM
    if (this.selRam != null) {
      for (const element of this.ramList) {
        if (element.name == this.choosenPC.nram) {
          this.newPrice -= element.price; // Subtrahiere den Preis des aktuellen RAMs
          this.newPrice += parseFloat(this.selRam.price); // Addiere den Preis des ausgewählten RAMs
        }
      }
    }

    // Überprüfe und aktualisiere den Preis basierend auf dem ausgewählten Speicher
    if (this.selSpeicher != null) {
      for (const element of this.speicherList) {
        if (element.name == this.choosenPC.nspeicher) {
          this.newPrice -= element.price; // Subtrahiere den Preis des aktuellen Speichers
          this.newPrice += parseFloat(this.selSpeicher.price); // Addiere den Preis des ausgewählten Speichers
        }
      }
    }

    // Überprüfe und aktualisiere den Preis basierend auf dem ausgewählten Betriebssystem
    if (this.selOS != null) {
      for (const element of this.osList) {
        if (element.name == this.choosenPC.nos) {
          this.newPrice -= element.price; // Subtrahiere den Preis des aktuellen Betriebssystems
          this.newPrice += parseFloat(this.selOS.price); // Addiere den Preis des ausgewählten Betriebssystems
        }
      }
    }
  }

  addToCart(): any {

    if (this.authService.isLoggedIn()) {
      if (this.choosenPC) {

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
        if (setPrice == null) {
          setPrice = this.choosenPC.pcprice;
        }

        this.orderService.placeCurrentOrder(null, this.choosenPC.pcid, setPrice, setRam, setSpeicher, setOS).subscribe(
          response => {
            console.log(response.message);
            this.router.navigate(["/cart"]);
          },
          error => {
            console.log("Error!");
          }
        );
      }
    }
    else{
      this.router.navigate(["/login"]);
    }
  }

}