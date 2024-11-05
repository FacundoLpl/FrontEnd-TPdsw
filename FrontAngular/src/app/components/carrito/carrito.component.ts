import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component.js';
import { FooterComponent } from '../footer/footer/footer.component.js';
import { UserFormComponent } from '../user-form/user-form.component.js';

import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, UserFormComponent, NgIf, NgFor],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
  
export class CarritoComponent {
  removeItem (code: number) {}
  total : number ;

 items: { code: number, name: string, price: number, quantity: number }[] = [];
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
