import { Component, Input, OnInit } from "@angular/core"
import { NavbarComponent } from "../navbar/navbar.component.js"
import { FooterComponent } from "../footer/footer/footer.component.js"
import { CartServiceService } from "../../services/cart-service.service.js"
import { Order } from "../../entities/order.entity.js"
import { NgFor, NgIf, NgClass, DecimalPipe } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { AuthService } from "../../core/services/auth.service.js"
import { RouterLink } from "@angular/router"
import { Cart } from "../../entities/cart.entity.js"
import { NotificationComponent } from "../notification/notification/notification.component.js"
import { NotificationService } from "../../services/notification.service.js"

@Component({
  selector: "app-carrito",
  standalone: true,
  imports: [NavbarComponent, FooterComponent, NgFor, FormsModule, NgIf, NgClass, DecimalPipe, RouterLink, NotificationComponent],
  templateUrl: "./carrito.component.html",
  styleUrls: ["./carrito.component.css"],
})
export class CarritoComponent implements OnInit {
  @Input() itemTitle = ""
  @Input() price = 0
  @Input() quantity = 1
  @Input() comment = ""
  orders: Order[] = []
  isLoggedIn = false
  isLoading = false
  isUpdating = false
  errorMessage = ""
  userId: string | null = null
  cartId: string | null = null
  deliveryType = "delivery"
  deliveryAddress = ""
  paymentMethod = "cash"
  contactNumber = ""
  additionalInstructions = ""
  total = 0
  // Nuevas propiedades para la UI mejorada
  showCheckoutForm = false
  isProcessing = false
  items: { itemTitle: string; price: number; quantity: number; comment: string }[] = []

  constructor(
    private cartService: CartServiceService,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  cart: any[] = []

  ngOnInit() {
    this.userId = this.authService.getId()
    this.isLoggedIn = this.authService.isLoggedIn()
    this.loadUserCart()
  }

  loadUserCart() {
    if (!this.userId) {
      this.handleError("Debes iniciar sesión para ver tu carrito")
      return
    }
    this.isLoading = true
    // Buscar carrito pendiente para el usuario
    this.cartService.findAll({ user: this.userId, state: "Pending" }).subscribe({
      next: (res: any) => {
        if (res.data && res.data.length > 0) {
          this.cart = res.data
          this.cartId = res.data[0].id // Guardar el ID del carrito
        } else {
          this.createNewCart()
        }
        this.isLoading = false
      },
      error: (err) => {
        this.handleApiError(err)
        this.isLoading = false
      },
    })
  }

  createNewCart() {
    if (!this.userId) return
    const newCart = {
      user: this.userId,
      state: "Pending",
      total: 0,
    }
    this.cartService.create(newCart).subscribe({
      next: (res: any) => {
        if (res.data) {
          this.cart = [res.data]
          this.cartId = res.data.id
        }
      },
      error: (err) => {
        this.handleApiError(err)
      },
    })
  }

  removeOrder(order: Order, cart: Cart) {
    // Determinar el ID correcto
    const orderId = order.id || (order as any)._id
    if (!orderId) {
      this.handleError("ID de orden no encontrado")
      return
    }
    // Convertir a string si es necesario
    const orderIdString = orderId.toString()
    this.cartService.deleteOrder(orderIdString, cart.id).subscribe({
      next: () => {
        const orderIndex = cart.orders.findIndex((o) => {
          const oId = o.id || (o as any)._id
          return oId?.toString() === orderIdString
        })
        if (orderIndex > -1) {
          cart.orders.splice(orderIndex, 1)
        }
        this.updateCartTotal(cart)
      },
      error: (err: any) => {
        this.handleApiError(err)
      },
    })
  }

  updateCartTotal(cart: Cart) {
    cart.total = 0
    cart.orders.forEach((order) => {
      cart.total += order.subtotal
    })
  }

  clearCart(cart: Cart) {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      const deletePromises = cart.orders.map(
        (order) =>
          new Promise<void>((resolve, reject) => {
            this.cartService.deleteOrder(order.id, cart.id).subscribe({
              next: () => resolve(),
              error: (err) => reject(err),
            })
          }),
      )
      Promise.all(deletePromises)
        .then(() => {
          cart.orders = []
          cart.total = 0
        })
        .catch((error) => {
          this.handleApiError(error)
        })
    }
  }

  toggleCheckoutForm() {
    this.showCheckoutForm = !this.showCheckoutForm
  }

  finalizarCompra(cart: Cart) {
    if (!this.contactNumber.trim()) {
      this.notificationService.error("Por favor ingresa un número de contacto")
      return
    }
    if (this.deliveryType === "delivery" && !this.deliveryAddress.trim()) {
      this.notificationService.error("Por favor ingresa una dirección de entrega")
      return
    }
    this.isProcessing = true
    
    // Crear el objeto con la fecha actual cuando se confirma el pedido
    const newCart = {
      state: "Completed",
      deliveryType: this.deliveryType,
      deliveryAddress: this.deliveryType === "delivery" ? this.deliveryAddress : null,
      paymentMethod: this.paymentMethod,
      contactNumber: this.contactNumber,
      additionalInstructions: this.additionalInstructions,
      date: new Date(), // Agregar la fecha actual cuando se confirma el pedido
    }
    
    this.cartService.completePurchase(cart.id, newCart).subscribe({
      next: (response: any) => {
        // Actualizar el carrito local con los datos del servidor
        if (response.data) {
          cart.state = response.data.state
          cart.date = response.data.date // Asignar la fecha del servidor
          cart.deliveryType = response.data.deliveryType
          cart.deliveryAddress = response.data.deliveryAddress
          cart.paymentMethod = response.data.paymentMethod
          cart.contactNumber = response.data.contactNumber
          cart.additionalInstructions = response.data.additionalInstructions
        } else {
          cart.state = "Completed"
          cart.date = new Date() // Fallback si no viene del servidor
        }
        
        this.updateCartTotal(cart)
        this.isProcessing = false
        this.showCheckoutForm = false
        this.resetCheckoutForm()
        this.notificationService.success("¡Pedido realizado con éxito! Te contactaremos pronto.")
        this.loadUserCart()
      },
      error: (err: any) => {
        this.handleApiError(err)
        this.isProcessing = false
      },
    })
  }

  resetCheckoutForm() {
    this.deliveryType = "delivery"
    this.deliveryAddress = ""
    this.paymentMethod = "cash"
    this.contactNumber = ""
    this.additionalInstructions = ""
  }

  getQuantityAsNumber(order: Order): number {
    // Ensure we always return a valid number
    const quantity = Number(order.quantity)
    return isNaN(quantity) || quantity <= 0 ? 1 : quantity
  }

  getUnitPrice(order: Order): number {
    const quantity = this.getQuantityAsNumber(order)
    if (quantity === 0) return 0
    return order.subtotal / quantity
  }

  handleError(message: string) {
    this.errorMessage = message
    setTimeout(() => {
      this.errorMessage = ""
    }, 5000)
  }

  handleAuthError(message: string) {
    this.errorMessage = message
    // Redirect to login after a short delay
    setTimeout(() => {
      this.authService.logout()
    }, 3000)
  }

  handleApiError(error: any) {
    if (error.status === 401) {
      this.handleAuthError("Tu sesión ha expirado. Redirigiendo al inicio de sesión...")
    } else if (error.error?.message) {
      this.errorMessage = error.error.message
    } else {
      this.errorMessage = "Ha ocurrido un error. Por favor intenta nuevamente."
    }
  }

  reloadPage() {
    window.location.reload()
  }

  goToLogin() {
    window.location.href = "/login?returnUrl=" + encodeURIComponent(window.location.pathname)
  }
}
