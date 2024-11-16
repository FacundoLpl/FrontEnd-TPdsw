import { Component, Input } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component.js';
import { FooterComponent } from '../footer/footer/footer.component.js';
import { UserFormComponent } from '../user-form/user-form.component.js';
import { CartServiceService } from '../../services/cart-service.service.js';
import { Order } from '../../entities/order.entity.js';
import { NgFor, NgIf } from '@angular/common';
import { Cart } from '../../entities/cart.entity.js';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, UserFormComponent, NgIf, NgFor],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
  
export class CarritoComponent {
  @Input() itemTitle: string;
  @Input() price: number;
  @Input() quantity: number;
  @Input() comment: string;
  orders:Order[]=[];

  removeItem (code: number) {}
  total : number ;

  items: { itemTitle: string, price: number, quantity: number, comment: string }[] = [];

  constructor(private cartService: CartServiceService) {}
  cart: Cart[] = []; // Asegura que es un array

  ngOnInit() {
    this.cartService.findAll({ user: "672d4f6cb48ca087afa73e84", state: 'Completed' }).subscribe({
      next: (res: any) => {
        this.cart = res.data; // Asigna todos los carts
        this.cart.forEach(cart => {
          cart.total = 0;
          cart.orders.forEach((order) => {
            if (order.product.category && order.product.category.discounts) {
              order.product.priceWithDiscount = parseFloat(
                (
                  order.product.price - order.product.price * (order.product.category.discounts[0].value / 100)
                ).toFixed(2)
              );
            }
            order.subtotal = order.product.priceWithDiscount
              ? order.product.priceWithDiscount * order.quantity
              : order.product.price * order.quantity;
            cart.total += order.subtotal;
          });
        });
      },
      error: (err: any) => console.error("Error fetching carts", err),
    });
  }

  removeOrder(order: Order, cart: Cart) {
        this.cartService.deleteOrder(order.id, cart.id).subscribe();
    };
  }


  /*
  import { CarritoService } from '../../services/carrito.service.js';

  constructor(private carritoService: CarritoService) {}

  get items() {
    return this.carritoService.getItems();
  }

  get total() {
    return this.carritoService.total;
  }
/* 
  removeItem(code: number) {
    this.carritoService.removeItem(code);
  } */
