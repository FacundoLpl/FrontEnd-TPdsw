import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order } from '../entities/order.entity';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  order: any;

  readonly baseUrl = 'http://localhost:3000/api/carts/';

  constructor(private http: HttpClient) { }

  findAll(filter: any) {
    let params = new HttpParams();
    if (filter.state) {
      params = params.set('state', filter.state);
    }
    if (filter.user) {
      params = params.set('user', filter.user);
    }
    return this.http.get(`${this.baseUrl}`, { params });
  }
  deleteOrder(orderId: string, cartId: string) {
    return this.http.delete(`${this.baseUrl}`+cartId+'/orders/'+ orderId);
  }


addOrder(quantity:number,cartId: string, productId: string) {
  this.order = {
    "quantity": quantity,
    "product": productId,
    "cart": cartId
  }
  return this.http.post<Order>(`${this.baseUrl}${cartId}/orders`, this.order);
}

}
