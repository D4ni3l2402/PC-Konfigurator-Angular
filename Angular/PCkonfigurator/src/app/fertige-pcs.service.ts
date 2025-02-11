import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FertigePCsService {

  private apiURL = 'http://localhost:3300/fertigpc';

  constructor(private http: HttpClient) { }

  selcetedName: string;

  // setfertigData(brand: string): void{
  //   this.selectedCpuBrand = brand;
  // }

  // setSelectedGpubrand(brand: string): void {
  //   this.selectedGpuBrand = brand;
  // }

  setfertigData(name: string): void{
    this.selcetedName = name;
  } 


  getFeritgPC(): Observable<any> {
    return this.http.get(this.apiURL);
  }
}
