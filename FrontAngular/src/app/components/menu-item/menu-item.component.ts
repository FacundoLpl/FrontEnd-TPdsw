import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-menu-item",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./menu-item.component.html",
  styleUrls: ["./menu-item.component.css"],
})
export class MenuItemComponent {
  @Input() title = ""
  @Input() imageUrl = ""
  @Input() altText = ""
  @Input() description?: string
  @Input() price?: number
  @Input() featured?: boolean = false
  @Input() productId?: string = ""

  // Eventos para interactuar con el componente padre
  @Output() itemClick = new EventEmitter<void>()
  @Output() addToCart = new EventEmitter<string>()

  // Estado de carga para el botón de agregar
  isAddingToCart = false

  onItemClick() {
    this.itemClick.emit()
  }

  onAddToCartClick(event: Event) {
    // Evitar que se propague el evento y abra el modal
    event.stopPropagation()

    if (!this.isAddingToCart && this.productId) {
      this.isAddingToCart = true

      // Emitir el ID del producto
      this.addToCart.emit(this.productId)

      // Simular finalización después de un tiempo (esto se manejará realmente en el componente padre)
      setTimeout(() => {
        this.isAddingToCart = false
      }, 1000)
    }
  }
}
