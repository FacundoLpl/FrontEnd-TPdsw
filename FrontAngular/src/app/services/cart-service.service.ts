import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order } from '../entities/order.entity';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  order: any;
  finalUrl: string;
  readonly baseUrl = 'http://localhost:3000/api/carts/';
  readonly orderUrl = 'http://localhost:3000/api/orders/';


  constructor(private http: HttpClient) { }

// HAY QUE CAMBIAR LA URL POR ORDER URL
  completePurchase(cartId: string, newCart: any): Observable<any> {
    const url = `${this.baseUrl}${cartId}`;
    
    return this.http.put(url, newCart);
    }
  // busca todos los carts segun los filtros. (carrito.component.ts)
  findAll(filter: any) { 
    let params = new HttpParams();
    if (filter.state) { // si se pasa un estado como filtro
      params = params.set('state', filter.state);
    }
    if (filter.user) { // si se pasa un usuario como filtro
      params = params.set('user', filter.user);
    }
    return this.http.get(`${this.baseUrl}`, { params });
  }
  
  deleteOrder(orderId: string, cartId: string) {
    return this.http.delete(`${this.orderUrl}`+ orderId);
  }
  
  
  // agrega una linea al pedido del user. (menu-item-modal.component.ts)
  addOrder(quantity: number, cartId: string, productId: string) {
    this.http.get<any>(this.orderUrl)

      .pipe(
        catchError(err => {
          return of({ data: [] }); // Retorna un objeto con data vacío en caso de error
        }))
      .subscribe({
        next: (response) => {
          const orders = response.data; // Accede al array en la propiedad data
  
          // Verificamos que orders sea un array válido
          if (!Array.isArray(orders)) {
            console.error("Respuesta inválida: 'orders' no es un array.");
            return;
          }

          // Buscamos si ya hay una orden con el mismo productId
          const existingOrder = orders.find(order => order.product === productId);
  
          if (existingOrder) {
            // Si ya existe, sumamos la cantidad
            const updatedQuantity = existingOrder.quantity + quantity;
            const updateUrl = `${this.orderUrl}${existingOrder.id}`;


  
            this.http.put(updateUrl, { quantity: updatedQuantity }).subscribe({
              error: (err) => console.error("Error al actualizar la cantidad:", err)
            });
          } else {
            // Si no existe, creamos una nueva orden
            this.order = {
              "quantity": quantity,
              "product": productId,
              "subtotal": 159,
              "user": "672d4f6cb48ca087afa73e84"
            };
            //  this.finalUrl = ${this.baseUrl}${cartId}/orders; 
            this.http.post<any>(this.orderUrl, this.order).subscribe({
            error: (err) => console.error("Error al agregar nueva orden:", err)
            });
          }
        },
      });
  }
}
