import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

readonly baseUrl = 'http://localhost:3000/api/products';

constructor(private http: HttpClient) { }

  findAll() {

    return this.http.get(`${this.baseUrl}`);
  }

}
