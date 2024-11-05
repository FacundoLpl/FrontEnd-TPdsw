import { Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component.js';
import { FooterComponent } from '../components/footer/footer/footer.component.js';
import { UserFormComponent } from '../components/user-form/user-form.component.js';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, UserFormComponent],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
  
export class CarritoComponent {
  constructor(private carritoService: CarritoService) {}

  get items() {
    return this.carritoService.getItems();
  }

  get total() {
    return this.carritoService.total;
  }

  removeItem(code: string) {
    this.carritoService.removeItem(code);
  }
}
