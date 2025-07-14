import { Injectable } from "@angular/core"
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http"
import { Observable, throwError, of } from "rxjs"
import { catchError } from "rxjs/operators"
import  { Order } from "../entities/order.entity"
import  { AuthService } from "../core/services/auth.service"
import { Router } from "@angular/router"

@Injectable({
  providedIn: "root",
})
export class CartServiceService {
  private baseUrl = "http://localhost:3000/api/carts/"
  private orderUrl = "http://localhost:3000/api/orders/"

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
  ) {}

  findAll(filter: any = {}): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      console.error("User not authenticated")
      this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } })
      return of({ error: "Authentication required" })
    }
    let params = new HttpParams()
    if (filter.state) {
      params = params.set("state", filter.state)
    }
    if (filter.user) {
      params = params.set("user", filter.user)
    }
    return this.http.get(this.baseUrl, { params }).pipe(catchError(this.handleError.bind(this)))
  }

  create(cartData: any): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      console.error("User not authenticated")
      this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } })
      return of({ error: "Authentication required" })
    }
    return this.http.post(this.baseUrl, cartData).pipe(catchError(this.handleError.bind(this))) // ACA
  }

  getCartWithOrders(cartId: string): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      console.error("User not authenticated")
      this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } })
      return of({ error: "Authentication required" })
    }
    return this.http.get(`${this.baseUrl}${cartId}`).pipe(catchError(this.handleError.bind(this)))
  }

  updateOrder(orderId: string, updatedOrder: Partial<Order>): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      console.error("User not authenticated")
      this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } })
      return of({ error: "Authentication required" })
    }
    if (updatedOrder.quantity !== undefined) {
      updatedOrder = {
        ...updatedOrder,
        quantity: Number(updatedOrder.quantity),
      }
    }
    return this.http.put(`${this.orderUrl}${orderId}`, updatedOrder).pipe(catchError(this.handleError.bind(this)))
  }

  deleteOrder(orderId: string, cartId: string): Observable<any> {
  if (!orderId || orderId === 'undefined') {
    return throwError(() => ({ message: 'ID de orden inválido' }));
  }
  if (!this.authService.isAuthenticated()) {
    console.error("User not authenticated");
    this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } });
    return of({ error: "Authentication required" });
  }
  return this.http.delete(`${this.orderUrl}${orderId}`).pipe(
    catchError((error) => {
      return this.handleError(error);
    })
  );
}
  completePurchase(cartId: string, cartData: any): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      console.error("User not authenticated")
      this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } })
      return of({ error: "Authentication required" })
    }
    return this.http.put(`${this.baseUrl}${cartId}`, cartData).pipe(catchError(this.handleError.bind(this)))
  }

addOrderToCart(orderData: {
  productName: string
  quantity: string | number
  subtotal: number
  comment?: string
  product: string
}): Observable<any> {
  if (!this.authService.isAuthenticated()) {
    console.error("User not authenticated")
    this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } })
    return of({ error: "Authentication required" })
  }
  const orderToSend = {
    ...orderData,
    quantity: Number(orderData.quantity),
  }

  // TEMPORAL: Forzar el header manualmente ?????????????????????? ver
  const token = this.authService.getToken();
  const headers = new HttpHeaders();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return this.http.post<any>(`${this.orderUrl}`, orderToSend, { headers }).pipe(
    catchError((err) => {
      console.error("❌ Error adding order to cart:", err)
      return this.handleError(err)
    }),
  )
  
}
  // Metodo ver todas las ordenes (para admin dashboard)
  getAllOrders(filter: any = {}): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      console.error("User not authenticated")
      this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } })
      return of({ error: "Authentication required" })
    }
    let params = new HttpParams()
    if (filter?.state) {
      params = params.set("state", filter.state)
    }
    if (filter?.user) {
      params = params.set("user", filter.user)
    }
    if (filter?.startDate) {
      params = params.set("startDate", filter.startDate)
    }
    if (filter?.endDate) {
      params = params.set("endDate", filter.endDate)
    }

    return this.http.get(`${this.orderUrl}`, { params }).pipe(
      catchError((error) => {
        console.error("Error fetching orders:", error)
        return this.handleError(error)
      }),
    )
  }
  getUserOrders(): Observable<any> {
  if (!this.authService.isAuthenticated()) {
    console.error("User not authenticated");
    this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } });
    return of({ error: "Authentication required" });
  }
  return this.http.get(`${this.baseUrl}my-orders`).pipe(
    catchError(this.handleError.bind(this))
  );
}
  updateOrderStatus(orderId: string, newStatus: string): Observable<any> {
    // Check authentication first
    if (!this.authService.isAuthenticated()) {
      console.error("User not authenticated")
      this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } })
      return of({ error: "Authentication required" })
    }
    return this.http.patch(`${this.orderUrl}${orderId}/status`, { state: newStatus }).pipe(
      catchError((error) => {
        console.error("Error updating order status:", error)
        return this.handleError(error)
      }),
    )
  }
  private handleError(error: any) {
    console.error("API error:", error)
    let errorMessage = "Ha ocurrido un error"
    if (error.error?.message) {
      errorMessage = error.error.message
    } else if (error.status === 401) {
      errorMessage = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
      this.authService.logout() 
    } else if (error.status === 404) {
      errorMessage = "Recurso no encontrado"
    } else if (error.status === 500) {
      errorMessage = "Error en el servidor. Por favor intenta más tarde."
    }
    return throwError(() => ({ message: errorMessage, originalError: error }))
  }
}
