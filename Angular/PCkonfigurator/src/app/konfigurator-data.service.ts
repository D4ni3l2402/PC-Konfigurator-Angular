import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KonfiguratorDataService {

  private apiURL = 'http://localhost:3300/items';
  

  selectedCpuBrand:string = "AMD";
  selectedGpuBrand:string = "NVIDIA";

  
  constructor(private http: HttpClient) { }

  getItems(): Observable<any> {
    return this.http.get(this.apiURL);
  }

  setSelectedCpuBrand(brand: string): void{
    this.selectedCpuBrand = brand;
  }

  setSelectedGpubrand(brand: string): void {
    this.selectedGpuBrand = brand;
  }

  // private cpuData = [
  //   { id: 1, name: 'CPU 1', price: 200 },
  //   { id: 2, name: 'CPU 2', price: 300 },
  //   // Weitere CPUs hier...
  // ];

  // private gpuData = [
  //   { id: 1, name: 'GPU 1', price: 400 },
  //   { id: 2, name: 'GPU 2', price: 500 },
  //   // Weitere GPUs hier...
  // ];

  // getCpuData() {
  //   return this.cpuData;
  // }

  // getGpuData() {
  //   return this.gpuData;
  // }



}
