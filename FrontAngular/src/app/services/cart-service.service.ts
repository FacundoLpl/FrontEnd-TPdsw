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
  isLoading: boolean = false;

  stats: { totalCarts: number; totalRevenue: number } = {
    totalCarts: 0,
    totalRevenue: 0,
  };

  salesChart: { labels: string[]; data: number[] } = {
    labels: [],
    data: [],
  };

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
  // Metodo ver pedidos recientes
  getAllCarts(filter: any = {}): Observable<any> {
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

    return this.http.get(`${this.baseUrl}`, { params }).pipe(
      catchError((error) => {
        console.error("Error fetching carts:", error)
        return this.handleError(error)
      }),
    )
  }
  // Metodo ver todas las ordenes (para admin dashboard)
  getTotalCarts(): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      console.error("User not authenticated");
      this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } });
      return of({ error: "Authentication required" });
    }
    return this.http.get(`${this.baseUrl}total`).pipe(
      catchError((error) => {
        console.error("Error fetching total carts:", error);
        return this.handleError(error);
      })
    );
  }
  // Metodo para saber el total de ingresos (para admin dashboard)
  getTotalRevenue(): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      console.error("User not authenticated");
      this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } });
      return of({ error: "Authentication required" });
    }
    return this.http.get(`${this.baseUrl}total-revenue`).pipe(
      catchError((error) => {
        console.error("Error fetching total revenue:", error);
        return this.handleError(error);
      })
    );
  }

  getWeeklyOrders(): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      console.error("User not authenticated");
      this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } });
      return of({ error: "Authentication required" });
    }
    return this.http.get(`${this.orderUrl}weekly`).pipe(
      catchError((error) => {
        console.error("Error fetching weekly orders:", error);
        return this.handleError(error);
      })
    );
  }

  loadStats(): void {
    this.isLoading = true;
    
    // Obtener total de pedidos
    this.getTotalCarts().subscribe({
      next: (res) => {
        this.stats.totalCarts = res.totalCarts || 0;
      },
      error: (err) => {
        console.error('Error cargando total de pedidos', err);
    },
  });

  // Obtener ingresos totales
  this.getTotalRevenue().subscribe({
    next: (res) => {
      this.stats.totalRevenue = res.totalRevenue || 0;
    },
    error: (err) => {
      console.error('Error cargando ingresos totales', err);
    },
  });

  this.isLoading = false;
}

  loadSalesData(): void {
    this.getWeeklyOrders().subscribe({
      next: (res) => {
        this.salesChart.labels = res.map((day: { day: string }) => day.day);
        this.salesChart.data = res.map((day: { amount: number }) => day.amount);
      },
      error: (err) => {
        console.error('Error cargando ventas semanales', err);
        // Datos de ejemplo en caso de error:
        this.salesChart = {
          labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
          data: [0, 0, 0, 0, 0, 0, 0],
        };
      },
    });
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
  updateCartState(cartId: string, newState: string): Observable<any> {
    // Check authentication first
    if (!this.authService.isAuthenticated()) {
      console.error("User not authenticated")
      this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } })
      return of({ error: "Authentication required" })
    }
    return this.http.put(`${this.baseUrl}${cartId}`, { state: newState }).pipe(
      catchError((error) => {
        console.error("Error updating cart state:", error)
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
