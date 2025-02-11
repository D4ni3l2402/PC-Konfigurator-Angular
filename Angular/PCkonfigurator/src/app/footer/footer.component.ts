import { Component } from '@angular/core';
import { KonfiguratorDataService } from '../konfigurator-data.service';
import { FertigePCsService } from '../fertige-pcs.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  selectedPCs: any[] = [];
  constructor(public konfiguratorService: KonfiguratorDataService, public fertigePCsService: FertigePCsService){
    this.fertigePCsService.getFeritgPC().subscribe(data => {
      this.selectedPCs = data; //console.log(this.selectedPCs);
    });
  }
}
