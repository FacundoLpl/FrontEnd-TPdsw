import { Component, Input, Output, EventEmitter  } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  quantity: number = 1;
  comment: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() orderAdded = new EventEmitter<{ quantity: number, comment: string }>();

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) this.quantity--;
  }

  addToOrder() {
    this.orderAdded.emit({ quantity: this.quantity, comment: this.comment });
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }
}