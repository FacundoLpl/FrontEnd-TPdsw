import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service'; // checkear q importe servicio de carrito

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
  @Output() orderAdded = new EventEmitter<{ quantity: number, comment: string }>();

  constructor(private carritoService: CarritoService) {} 

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart() {
    this.carritoService.addItem({
      name: this.itemTitle,
      price: this.price,
      quantity: this.quantity,
      comment: this.comment
    });
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }
}
