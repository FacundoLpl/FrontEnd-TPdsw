import { Component, Input } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component.js';
import { FooterComponent } from '../footer/footer/footer.component.js';
import { UserFormComponent } from '../user-form/user-form.component.js';
import { CartServiceService } from '../../services/cart-service.service.js';
import { Order } from '../../entities/order.entity.js';
import { NgFor, NgIf } from '@angular/common';
import { Cart } from '../../entities/cart.entity.js';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, NgFor, UserFormComponent,FormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
  
export class CarritoComponent {
  @Input() itemTitle: string;
  @Input() price: number;
  @Input() quantity: number;
  @Input() comment: string;
  orders:Order[]=[];
  
  deliveryType: string = 'delivery'; // Valor por defecto
  deliveryAddress: string = '';
  paymentMethod: string = 'cash'; // Solo efectivo por ahora
  contactNumber: string = '';
  additionalInstructions: string = '';

  removeItem (code: number) {}
  total : number ;

  items: { itemTitle: string, price: number, quantity: number, comment: string }[] = [];

  constructor(private cartService: CartServiceService) {}
  cart: Cart[] = []; // Asegura que es un array
  cartId: string = ''; // Add cartId property
 newCart: any;
  
  ngOnInit() {
    this.cartService.findAll({ user: "672d4f6cb48ca087afa73e84", state: 'Pending' }).subscribe({
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

 // Eliminar un producto específico dentro de un carrito
 removeOrder(order: Order, cart: Cart) {
  // Llamada al servicio para eliminar la orden del carrito
  this.cartService.deleteOrder(order.id, cart.id).subscribe({
    next: () => {
      // Si la eliminación fue exitosa, elimina la orden localmente
      const orderIndex = cart.orders.findIndex(o => o.id === order.id);
      if (orderIndex > -1) {
        cart.orders.splice(orderIndex, 1); // Elimina el producto del carrito
      }

      // Recalcular el total del carrito después de eliminar el pedido
      this.updateCartTotal(cart);
    },
    error: (err) => console.error("Error deleting order", err)
  });
}
updateCartTotal(cart: Cart) {
  cart.total = 0; // Reinicia el total
  cart.orders.forEach((order) => {
    cart.total += order.subtotal; // Suma los subtotales de los pedidos restantes
  });
}
finalizarCompra(
  cart: Cart, 
  deliveryType: string,
  deliveryAddress: string,
  paymentMethod: string,
  contactNumber: string,
  additionalInstructions: string) {
  // Llama al servicio para completar la compra
  this.newCart = {
    "state": "Completed",
    "deliveryType": deliveryType,
    "deliveryAddress": deliveryAddress,
    "paymentMethod": paymentMethod,
    "contactNumber":contactNumber,
    "additionalInstructions":additionalInstructions}

  this.cartService.completePurchase(cart.id,this.newCart).subscribe({
    next: () => {
      console.log(this.newCart,"Compra finalizada y carrito actualizado");
      cart.state = "Completed"; 
      // Opcional: actualiza el total o realiza otras acciones necesarias
      this.updateCartTotal(cart);

    }
  });
}




submitData() {
    // Validamos la dirección solo si la entrega es "delivery"
    const formData = {
      deliveryType: this.deliveryType,
      deliveryAddress: this.deliveryType === 'delivery' ? this.deliveryAddress : null,
      paymentMethod: this.paymentMethod,
      contactNumber: this.contactNumber,
      additionalInstructions: this.additionalInstructions
    };

    // Aquí puedes procesar los datos, como enviarlos a un servidor o mostrarlos en consola
    console.log('Datos de entrega y pago:', formData);

    // Lógica adicional, como limpiar el formulario o mostrar un mensaje de confirmación
    alert('Datos de entrega y pago enviados correctamente.');
  }
  }