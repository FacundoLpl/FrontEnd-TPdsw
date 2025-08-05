import { Component, Input, Output, EventEmitter,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import  { CartServiceService } from "../../services/cart-service.service"
import { AuthService } from "../../core/services/auth.service"
import { NotificationService } from "../../services/notification.service.js"

@Component({
  selector: "app-menu-item-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./menu-item-modal.component.html",
  styleUrls: ["./menu-item-modal.component.css"],
})
export class MenuItemModalComponent implements OnInit {
  // Inputs que coinciden con tu carta.component.html
  @Input() itemTitle = ""
  @Input() imageUrl = ""
  @Input() productId = ""
  @Input() price = 0

  // Output para cerrar el modal
  @Output() close = new EventEmitter<void>()

  // Propiedades del formulario
  quantity = 1
  comment = ""
  isProcessing = false

  constructor(
    private cartService: CartServiceService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Inicialización si es necesaria
  }

  onQuantityChange() {
    if (this.quantity < 1) this.quantity = 1
  }

  getTotalPrice(): number {
    return this.price * this.quantity
  }

  // Update the onAddToCart method to include product name
  onAddToCart() {
    const userId = this.authService.getId()
    if (!userId) {
      alert("Debes iniciar sesión para agregar productos al carrito")
      return
    }

    this.isProcessing = true

    // Crear el objeto de order con quantity como número explícitamente
    const orderData = {
      productName: this.itemTitle, 
      quantity: Number(this.quantity), 
      subtotal: this.getTotalPrice(),
      comment: this.comment || undefined,
      product: this.productId,
    }


    // Usar el método correcto del servicio
    this.cartService.addOrderToCart(orderData).subscribe({
      next: (response: any) => {
        this.isProcessing = false

        if (response.error) {
          this.notificationService.success("Error: " + response.error)
        } else {
          this.notificationService.success("¡Producto agregado al carrito!")
          this.onClose()
        }
      },
      error: (err: any) => {
        this.isProcessing = false
        this.notificationService.success("Error al agregar el producto al carrito")
      },
    })
  }

  onClose() {
    this.close.emit()
  }
}
