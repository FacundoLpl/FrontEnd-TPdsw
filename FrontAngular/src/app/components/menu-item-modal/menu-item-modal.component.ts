import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartServiceService } from '../../services/cart-service.service.js';
import { Cart } from '../../entities/cart.entity.js';
import { AuthService } from '../../core/services/auth.service.js';


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
  userId: string;

  @Output() close = new EventEmitter<void>();

  @Output() agregarAlCarrito = new EventEmitter<any>();
  constructor(private cartService: CartServiceService, private AuthService: AuthService) {}
  ngOnInit() {
    const user = this.AuthService.getId()
    if (user != null){
      this.userId = user
    this.cartService.findAll({ user: this.userId, state: 'Pending' }).subscribe({
    next: (res: any) => {
      this.cart = res.data; // Asigna todos los carts
      this.cartId = this.cart[0].id;
    },
    error: (err) => console.error("Error fetching carts", err),
  });}
}
  addToCart(quantity:number,productId: string) {
  
    this.cartService.addOrder(quantity,this.cartId, productId, this.userId, this.price);
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
