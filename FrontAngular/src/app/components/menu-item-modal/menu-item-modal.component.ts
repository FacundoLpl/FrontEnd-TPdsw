import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartServiceService } from '../../services/cart-service.service.js';
import { Cart } from '../../entities/cart.entity.js';


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
  @Input() productId: string = '';
  @Input() price: number  ; // checkear que recib el precio
  quantity: number = 1;
  comment: string = '';
  cartItem: any;
  newOrder: any;
  cart: Cart[] = []; // Asegura que es un array 
  cartId: string;

  @Output() close = new EventEmitter<void>();

  @Output() agregarAlCarrito = new EventEmitter<any>();
  constructor(private cartService: CartServiceService) {}
  
  ngOnInit() {this.cartService.findAll({ user: "672d4f6cb48ca087afa73e84", state: 'Pending' }).subscribe({
    next: (res: any) => {
      this.cart = res.data; // Asigna todos los carts
      this.cartId = this.cart[0].id;
    },
    error: (err) => console.error("Error fetching carts", err),
  });
}
  addToCart(quantity:number,productId: string) {
  
    this.cartService.addOrder(quantity,this.cartId, productId);
    this.closeModal();

  }
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
