import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrendsService {

  constructor(private http: HttpClient) { }



  getTrends(){ //  returns an observable
    return this.http.get('http://localhost:3300/trends');
  }
}
