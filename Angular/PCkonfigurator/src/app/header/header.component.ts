import { Component } from '@angular/core';
import { Router  } from '@angular/router';
import { AuthService } from '../auth.service';
import { KonfiguratorDataService } from '../konfigurator-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private authService: AuthService, private router: Router, private konfiguratorDataService: KonfiguratorDataService){
    this.konfiguratorDataService.getItems().subscribe(data => {
      this.selectedItems = data;
    });
  }
  isModalOpen: boolean = false;
  selectedCategory: string = '';
  selectedItems: any[] = [];
  items: any[] = [];
  clicked: any;
  itemExist:boolean;


  openSidebar(): void {
    let menu = document.querySelector(".sidebar");
    menu.classList.toggle("open");
    console.log(this.isLoggedIn());
    console.log(this.authService.userDetails);
    this.hamClick();
  }

  navigateToCart(): void {
    this.router.navigate(["/cart"]);
  }

  getCurrentUser(): string | null {

    return this.authService.getCurrentUser();

  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.router.navigate(["/start"]);
    this.authService.setNotifyOut(true);
    this.authService.setNotifyIn(false);
    return this.authService.logout();
  }

  login(): void {
    this.router.navigate(["/login"]);
  }

  register(): void {
    this.router.navigate(["/register"]);
  }

  hamClick(): void {
    var iconI = document.querySelector(".iconPartI");
    var iconII = document.querySelector(".iconPartII");
    var iconIII = document.querySelector(".iconPartIII");
    console.log("asd")
    iconI.classList.toggle("active");
    iconII.classList.toggle("active");
    iconIII.classList.toggle("active");
  }

  showModal(category: string): void {
    this.selectedCategory = category;
    this.items = this.selectedItems.filter(item => item.typeof === category); // && this.isBrandSelected(item)
    this.isModalOpen = true;

    // Lade die entsprechenden Daten für das ausgewählte Element
    // if(category == "CPU"){
    //   this.selectedItems = this.konfiguratorDataService.getCpuData();
    // } else if(category == "GPU"){
    //   this.selectedItems = this.konfiguratorDataService.getGpuData();
    // }
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

}


