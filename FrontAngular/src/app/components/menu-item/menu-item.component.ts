import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReviewServiceService } from "../../services/review-service.service"
import { Router } from '@angular/router'

@Component({
  selector: "app-menu-item",
  standalone: true,
  imports: [CommonModule], // Ya no importes ReviewModalComponent acá
  templateUrl: "./menu-item.component.html",
  styleUrls: ["./menu-item.component.css"],
})
export class MenuItemComponent implements OnInit {
  constructor(private reviewService: ReviewServiceService, private router: Router) { }

  @Input() title = ""
  @Input() imageUrl = ""
  @Input() altText = ""
  @Input() description?: string
  @Input() price?: number
  @Input() featured?: boolean = false
  @Input() productId?: string = ""

  @Output() itemClick = new EventEmitter<void>()
  @Output() addToCart = new EventEmitter<string>()

  // NUEVO: Evento para avisar al padre que quiere abrir modal con este producto
  @Output() verResenas = new EventEmitter<string>()

  isAddingToCart = false
  averageRating: number = 0

  ngOnInit() {
    if (this.productId) {
      this.reviewService.getReviewsByProductId(this.productId).subscribe((reviews: { rating: number }[]) => {
        if (reviews.length) {
          const total = reviews.reduce((sum, r) => sum + r.rating, 0)
          this.averageRating = total / reviews.length
        }
      })
    }
  }

  goToReviews(event: Event) {
    event.stopPropagation()
    this.router.navigate(['/reviews', this.productId])
  }

  onItemClick() {
    this.itemClick.emit()
  }

  onAddToCartClick(event: Event) {
    event.stopPropagation()
    if (!this.isAddingToCart && this.productId) {
      this.isAddingToCart = true
      this.addToCart.emit(this.productId)
      setTimeout(() => {
        this.isAddingToCart = false
      }, 1000)
    }
  }

  // CAMBIO: emitir el evento para abrir modal
  abrirModal(productId?: string): void {
    if (!productId) return;
    this.verResenas.emit(productId)
  }


  // cerrarModal(): void {
  //   this.mostrarModal = false
  // }
}
