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
    // Check authentication first
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
    // Check authentication first
    if (!this.authService.isAuthenticated()) {
      console.error("User not authenticated")
      this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } })
      return of({ error: "Authentication required" })
    }

    return this.http.post(this.baseUrl, cartData).pipe(catchError(this.handleError.bind(this)))
  }

  getCartWithOrders(cartId: string): Observable<any> {
    // Check authentication first
    if (!this.authService.isAuthenticated()) {
      console.error("User not authenticated")
      this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } })
      return of({ error: "Authentication required" })
    }

    return this.http.get(`${this.baseUrl}${cartId}`).pipe(catchError(this.handleError.bind(this)))
  }

  updateOrder(orderId: string, updatedOrder: Partial<Order>): Observable<any> {
    // Check authentication first
    if (!this.authService.isAuthenticated()) {
      console.error("User not authenticated")
      this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } })
      return of({ error: "Authentication required" })
    }

    // Ensure quantity is sent as a number
    if (updatedOrder.quantity !== undefined) {
      updatedOrder = {
        ...updatedOrder,
        quantity: Number(updatedOrder.quantity),
      }
    }

    return this.http.put(`${this.orderUrl}${orderId}`, updatedOrder).pipe(catchError(this.handleError.bind(this)))
  }

  deleteOrder(orderId: string, cartId: string): Observable<any> {
  console.log('🔍 Service: Deleting order with ID:', orderId);
  console.log('🔍 Service: Cart ID:', cartId);
  
  // Validar que el orderId sea válido
  if (!orderId || orderId === 'undefined') {
    console.log('❌ Invalid order ID in service');
    return throwError(() => ({ message: 'ID de orden inválido' }));
  }

  // Check authentication first
  if (!this.authService.isAuthenticated()) {
    console.error("User not authenticated");
    this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } });
    return of({ error: "Authentication required" });
  }

  console.log('🔍 Making DELETE request to:', `${this.orderUrl}${orderId}`);
  
  return this.http.delete(`${this.orderUrl}${orderId}`).pipe(
    catchError((error) => {
      console.log('❌ DELETE request failed:', error);
      return this.handleError(error);
    })
  );
}

  completePurchase(cartId: string, cartData: any): Observable<any> {
    // Check authentication first
    if (!this.authService.isAuthenticated()) {
      console.error("User not authenticated")
      this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } })
      return of({ error: "Authentication required" })
    }

    return this.http.put(`${this.baseUrl}${cartId}`, cartData).pipe(catchError(this.handleError.bind(this)))
  }

  // Method to add order to cart

addOrderToCart(orderData: {
  productName: string
  quantity: string | number
  subtotal: number
  comment?: string
  product: string
}): Observable<any> {
  // Debug authentication
  console.log('🔍 Auth check:', this.authService.isAuthenticated());
  console.log('🔑 Token exists:', !!this.authService.getToken());
  console.log('👤 User ID:', this.authService.getId());

  // Check authentication first
  if (!this.authService.isAuthenticated()) {
    console.error("User not authenticated")
    this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } })
    return of({ error: "Authentication required" })
  }

  // Create a new object with quantity converted to number
  const orderToSend = {
    ...orderData,
    quantity: Number(orderData.quantity),
  }

  // TEMPORAL: Forzar el header manualmente
  const token = this.authService.getToken();
  const headers = new HttpHeaders();
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
    console.log('🔧 MANUAL - Adding Authorization header:', `Bearer ${token.substring(0, 20)}...`);
  }

  console.log('📤 MANUAL - Request headers:', headers.keys());

  return this.http.post<any>(`${this.orderUrl}`, orderToSend, { headers }).pipe(
    catchError((err) => {
      console.error("❌ Error adding order to cart:", err)
      return this.handleError(err)
    }),
  )
  console.log('📤 Sending order data:', orderToSend);
  console.log('🎯 Request URL:', this.orderUrl);

  return this.http.post<any>(`${this.orderUrl}`, orderToSend).pipe(
    catchError((err) => {
      console.error("❌ Error adding order to cart:", err)
      return this.handleError(err)
    }),
  )

  
}
  // Method to get all orders (for admin dashboard)
  getAllOrders(filter: any = {}): Observable<any> {
    // Check authentication first
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
  // Method to update order status
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
      this.authService.logout() // Log out the user if unauthorized
    } else if (error.status === 404) {
      errorMessage = "Recurso no encontrado"
    } else if (error.status === 500) {
      errorMessage = "Error en el servidor. Por favor intenta más tarde."
    }

    return throwError(() => ({ message: errorMessage, originalError: error }))
  }
}
