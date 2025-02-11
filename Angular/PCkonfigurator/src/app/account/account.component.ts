import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  details: any;
  bestellungen: any[] = [];
  //new
  userOderdDetails: any;
  orderd: any[] = [];
  itemsPCList: any[] = [];

  ifDiscounted: boolean;

  constructor(private authService: AuthService, private orderService: OrderService) {
    this.details = authService.userDetails;

    this.orderService.showOrders().subscribe(data => {
      this.bestellungen = data;
      console.log(data);
    });

  }

  showList(): void {
    const sortedBestellungen = this.bestellungen.sort((a, b) => a.bestellungnr - b.bestellungnr);
    // console.log(sortedBestellungen);
  }

  //n
  ngOnInit(): void {
    this.fetchUserOrderd();
  }

  //
  fetchUserOrderd(): void {
    this.orderService.getUserOrderd().subscribe(data => {
      // die gefilterte data wird dann eingegeben
      this.orderd = this.prepareOrderdData(data);
      // console.log(this.orderd);
    });
  }

  getItemsByBestellNr(bestellnr: any, data: any[]): any[] {
    let stuff = data.filter(item => item.bestellnr === bestellnr)
    return stuff;
  }

  prepareOrderdData(data: any[]): any[] {
    const uniqueOrders = [];

    const map = new Map();



    data.forEach(item => {
      let totalpriceperBestellungen = 0;
      let itemsList = [];

      const orderdate = item.orderdate;
      const bestellnr = item.bestellungnr;

      let itemPrice = parseFloat(item.price);
      let pcPrice = parseFloat(item.pcprice);

      let discount;
      let discounted;


      if (isNaN(itemPrice)) {
        itemPrice = 0;
      }

      if (isNaN(pcPrice)) {
        pcPrice = 0;
      }

      // console.log(item.discountpercent);

      if(item.discountpercent !== null){
        discount = item.discountpercent
        discounted = true;
      }
      else{
        discount = null;
        discounted = false;
      }

      let selRam;
      let selSpeicher;
      let selOS;

      if(selRam !== null){
        selRam = item.ram
      }
      if(selSpeicher !== null){
        selSpeicher = item.speicher        
      }
      if(selOS !== null){
        selOS = item.OS   
      }

      totalpriceperBestellungen += itemPrice + pcPrice;
      console.log(discounted);

      if (!map.has(bestellnr)) {
        map.set(item.bestellungnr, item.orderdate);
        let itemName;
        let price;

        if (item.itemsnr == null) {
          itemName = item.namepc;
          price = parseFloat(item.pcprice);
        }
        else {
          itemName = item.name;
          price = item.price;
        }
        
        itemsList.push({ name: itemName, price: price, selRam, selSpeicher, selOS });
        uniqueOrders.push({ bestellnr, orderdate, totalpriceperBestellungen, itemsList,  discount, discounted});
      }

      else {
        let itemName;
        let price;
        if (item.itemsnr == null) {
          itemName = item.namepc;
          price = parseFloat(item.pcprice);
        }
        else if(item.pcid == null) {
          itemName = item.name;
          price = item.price;
        }
        const existingOrderIndex = uniqueOrders.findIndex(order => order.bestellnr === bestellnr);
        uniqueOrders[existingOrderIndex].totalpriceperBestellungen += totalpriceperBestellungen;
        uniqueOrders[existingOrderIndex].itemsList.push({ name: itemName, price: price, selRam, selSpeicher, selOS});
      }

    });
    return uniqueOrders;
  }
}
