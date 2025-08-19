import { Component, OnInit } from "@angular/core"
import { CartServiceService } from "../../services/cart-service.service"
import { AuthService } from "../../core/services/auth.service"
import { NgFor, NgIf, DatePipe, DecimalPipe, NgClass } from "@angular/common"
import { NavbarComponent } from "../navbar/navbar.component"
import { FooterComponent } from "../footer/footer/footer.component"
import { ReviewServiceService } from "../../services/review-service.service"
import { FormsModule } from "@angular/forms"
import { NotificationService } from "../../services/notification.service"

@Component({
  selector: "app-mis-pedidos",
  standalone: true,
  imports: [NgFor, NgClass, NgIf, DatePipe, DecimalPipe, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: "./mis-pedidos.component.html",
  styleUrls: ["./mis-pedidos.component.css"],
})

export class MisPedidosComponent implements OnInit {
  orders: any[] = []
  isLoading = false
  errorMessage = ""
  isLoggedIn = false

  currentReviewId: string | null = null
  rating: number = 0
  comment: string = ""
  isSubmittingReview: boolean = false
  successMessage: string = ""
  formErrorMessage: string = ""
  userId: string = "user-123"

  constructor(
    private cartService: CartServiceService,
    private authService: AuthService,
    private reviewService: ReviewServiceService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn()
    if (this.isLoggedIn) {
      this.loadUserOrders()
    }
  }

  startReview(productId: string): void {
    this.currentReviewId = productId
    this.rating = 0
    this.comment = ""
    this.isSubmittingReview = false
    this.successMessage = ""
    this.formErrorMessage = ""
  }

  cancelReview(): void {
    this.currentReviewId = null
    this.rating = 0
    this.comment = ""
    this.isSubmittingReview = false
    this.successMessage = ""
    this.formErrorMessage = ""
  }

  setRating(rating: number): void {
    this.rating = rating
  }

submitReview(productId: string): void {
  if (this.rating === 0 || this.comment.trim() === "") {
    this.notificationService.error("Por favor, selecciona una calificación y escribe un comentario.")
    return
  }

  this.isSubmittingReview = true
  this.formErrorMessage = ""

  const reviewData: ReviewData = {
    product: productId,
    rating: this.rating,
    comment: this.comment,
  }
  this.reviewService.createReview(reviewData).subscribe({
    next: () => {
      this.notificationService.success("¡Gracias por tu reseña!")
      this.isSubmittingReview = false
      setTimeout(() => this.cancelReview(), 2000)
    },
    error: (err: any) => {
      console.error("Error al enviar reseña:", err)
      this.notificationService.error("Ocurrió un error al enviar tu reseña. Por favor, inténtalo de nuevo.")
      this.isSubmittingReview = false
    },
  })
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

  // Nuevo método para obtener la fecha correcta del pedido
  getOrderDate(order: any): Date {
    // Priorizar la fecha del pedido (date) sobre la fecha de creación (createdAt)
    if (order.date) {
      return new Date(order.date)
    } else if (order.createdAt) {
      return new Date(order.createdAt)
    } else {
      // Fallback en caso de que no haya ninguna fecha
      return new Date()
    }
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

  // Métodos para las reseñas
  openProductReview(orderItem: any) {
    console.log("Opening product review for:", orderItem)
    // Aquí puedes implementar la lógica para abrir un modal de reseña
    // o navegar a una página de reseña específica del producto
    //alert(`Abriendo reseña para: ${orderItem.product?.name || orderItem.productName}`)
    this.startReview(orderItem.product.id)
  }

  openOrderReview(order: any) {
    console.log("Opening order review for:", order)
    // Aquí puedes implementar la lógica para abrir un modal de reseña
    // o navegar a una página de reseña del pedido completo
    alert(`Abriendo reseña para el pedido #${order.id.substring(order.id.length - 8)}`)
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
interface ReviewData {
  product: string
  rating: number
  comment: string
}