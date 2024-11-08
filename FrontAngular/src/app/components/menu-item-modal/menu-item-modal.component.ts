import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartServiceService } from '../../services/cart-service.service.js';
import { Order } from '../../entities/order.entity.js';
import { Cart } from '../../entities/cart.entity.js';
import { Product } from '../../entities/product.entity.js';

@Component({
  selector: 'app-menu-item-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './menu-item-modal.component.html',
  styleUrl: './menu-item-modal.component.css'
})
export class MenuItemModalComponent {
  @Input() itemTitle: string = '';
  @Input() imageUrl: string = '';
  @Input() price: number = 0; // checkear que recib el precio
  quantity: number = 1;
  comment: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() orderAdded = new EventEmitter<{ itemTitle: string, price: number, quantity: number, comment: string }>();
  @Output() agregarAlCarrito = new EventEmitter<any>();
  constructor(private cartService: CartServiceService) {}
  /*
  addToCart(quantity:number,cart: Cart, product: Product) {
    this.cartService.addOrder(quantity,cart.id, productId).subscribe({
      next: (newOrder: Order) => {
        cart.orders.push(newOrder);
      },
      error: (err) => {
        console.error("Error al agregar la orden:", err);
      }
    });
  
  }*/

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) this.quantity--;
  }

  closeModal() {
    this.close.emit();
  }
}

