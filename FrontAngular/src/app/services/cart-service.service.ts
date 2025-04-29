import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order } from '../entities/order.entity';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  order: any;
  finalUrl: string;
  readonly baseUrl = 'http://localhost:3000/api/carts/';
  readonly orderUrl = 'http://localhost:3000/api/orders/';

  constructor(private http: HttpClient, private authService:AuthService) { }

// HAY QUE CAMBIAR LA URL POR ORDER URL
  completePurchase(cartId: string, newCart: any): Observable<any> {
    const url = `${this.baseUrl}${cartId}`;
    
    return this.http.put(url, newCart);
    }
  // busca todos los carts segun los filtros. (carrito.component.ts)
  findAll(filter: any = {}) {
    // 1. Configurar headers con el token
    const token = this.authService.getToken();
  

    // 2. Configurar parámetros de consulta
    let params = new HttpParams();
    
    if (filter.state) {
      params = params.set('state', filter.state);
    }
    
    if (filter.user) {
      params = params.set('user', filter.user);
    }

    // 3. Realizar la petición con headers y params
    return this.http.get(`${this.baseUrl}`, { 
      params: params
    });
}
   // const token = this.authService.getToken(); // Método que obtiene tu token
   // const headers = new HttpHeaders({
   //   'Authorization': `Bearer ${token}`});
  deleteOrder(orderId: string, cartId: string) {
    return this.http.delete(`${this.orderUrl}`+ orderId);
  }
  
  
  // agrega una linea al pedido del user. (menu-item-modal.component.ts)
  /* addOrder(quantity: number, cartId: string, productId: string, userId: string) {
    
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
              "user": userId
            };
            //  this.finalUrl = ${this.baseUrl}${cartId}/orders; 
            this.http.post<any>(this.orderUrl, this.order).subscribe({
            error: (err) => console.error("Error al agregar nueva orden:", err)
            });
          }
        },
      });
  } */
 addOrder(quantity: number, cartId: string, productId: string, userId: string, price: number) {
  // First validate the quantity
  if (quantity <= 0) {
    console.error("Invalid quantity");
    return;
  }
  const subtotal = quantity * price;
  
  const orderPayload = {
    quantity: quantity,
    product: productId,
    user: userId,
    subtotal: subtotal  // Add calculated subtotal
  };

  // Send to backend which will handle all the logic
  this.http.post<any>(`${this.orderUrl}`, orderPayload).subscribe({
    next: (response) => {
      // Handle successful order creation
      console.log("Order processed successfully", response);
    },
    error: (err) => {
      console.error("Error processing order:", err);
      // Show user-friendly error message based on status code
      if (err.status === 400) {
        alert("Invalid order data: " + err.error.message);
      } else if (err.status === 403) {
        alert("You don't have permission to perform this action");
      } else if (err.status === 409) {
        alert("Not enough stock available");
      } else {
        alert("An unexpected error occurred");
      }
    }
  });
}

}