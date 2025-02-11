import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KonfiguratorDataService } from '../konfigurator-data.service';


@Component({
  selector: 'app-cpu',
  templateUrl: './cpu.component.html',
  styleUrls: ['./cpu.component.scss']
})
export class CpuComponent {

  // private name: String;

  constructor(private router: Router, private konfiguratorService: KonfiguratorDataService){}

  navigate(){
    this.router.navigate(["/konfigurator/gpu"]);
  }

  selectCpuBrand(brand: string):void {
    this.konfiguratorService.setSelectedCpuBrand(brand)
    console.log(this.konfiguratorService.selectedCpuBrand);
    this.navigate();
  }

}
