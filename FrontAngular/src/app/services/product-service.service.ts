import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order } from '../entities/order.entity.js';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  order: Order;

readonly baseUrl = 'http://localhost:3000/api/products';

constructor(private http: HttpClient) { }

  findAll() {

    return this.http.get(`${this.baseUrl}`);
  }

}
