import { Component,  OnInit } from "@angular/core"
import  { CartServiceService } from "../../services/cart-service.service"
import  { AuthService } from "../../core/services/auth.service"
import { NgFor, NgIf, DatePipe, DecimalPipe, NgClass } from "@angular/common"
import { NavbarComponent } from "../navbar/navbar.component"
import { FooterComponent } from "../footer/footer/footer.component"

@Component({
  selector: "app-mis-pedidos",
  standalone: true,
  imports: [NgFor,NgClass, NgIf, DatePipe, DecimalPipe, NavbarComponent, FooterComponent],
  templateUrl: "./mis-pedidos.component.html",
  styleUrls: ["./mis-pedidos.component.css"],
})
export class MisPedidosComponent implements OnInit {
  orders: any[] = []
  isLoading = false
  errorMessage = ""
  isLoggedIn = false

  constructor(
    private cartService: CartServiceService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn()
    if (this.isLoggedIn) {
      this.loadUserOrders()
    }
  }

  loadUserOrders() {
    this.isLoading = true
    this.cartService.getUserOrders().subscribe({
      next: (response: any) => {
        if (response.data) {
          this.orders = response.data
          console.log("User orders loaded:", this.orders)
        }
        this.isLoading = false
      },
      error: (error: any) => {
        console.error("Error loading orders:", error)
        this.handleApiError(error)
        this.isLoading = false
      },
    })
  }

  getOrderStatus(order: any): string {
    switch (order.state) {
      case "Completed":
        return "Confirmado"
      case "Pending":
        return "Pendiente"
      case "Canceled":
        return "Cancelado"
      default:
        return order.state
    }
  }

  getOrderStatusClass(order: any): string {
    switch (order.state) {
      case "Completed":
        return "status-completed"
      case "Pending":
        return "status-pending"
      case "Canceled":
        return "status-canceled"
      default:
        return "status-unknown"
    }
  }

  getDeliveryTypeText(order: any): string {
    return order.deliveryType === "delivery" ? "Delivery" : "Recoger en Tienda"
  }

  getPaymentMethodText(order: any): string {
    switch (order.paymentMethod) {
      case "cash":
        return "Efectivo"
      case "card":
        return "Tarjeta"
      case "transfer":
        return "Transferencia"
      default:
        return order.paymentMethod || "No especificado"
    }
  }

  private handleApiError(error: any) {
    if (error.status === 401) {
      this.errorMessage = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
      setTimeout(() => {
        this.authService.logout()
      }, 3000)
    } else if (error.error?.message) {
      this.errorMessage = error.error.message
    } else {
      this.errorMessage = "Ha ocurrido un error. Por favor intenta nuevamente."
    }
  }

  goToLogin() {
    window.location.href = "/login?returnUrl=" + encodeURIComponent(window.location.pathname)
  }
}
