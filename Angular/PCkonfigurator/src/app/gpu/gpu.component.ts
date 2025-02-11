import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KonfiguratorDataService } from '../konfigurator-data.service';

@Component({
  selector: 'app-gpu',
  templateUrl: './gpu.component.html',
  styleUrls: ['./gpu.component.scss']
})
export class GpuComponent {

  constructor(private router: Router, private konfiguratorService: KonfiguratorDataService){}

  navigate(){
    this.router.navigate(["/konfigurator"]);
  }

  selectGpuBrand(brand: string): void {
    this.konfiguratorService.setSelectedGpubrand(brand);
    console.log(this.konfiguratorService.selectedGpuBrand);
    this.navigate();
  }

}
