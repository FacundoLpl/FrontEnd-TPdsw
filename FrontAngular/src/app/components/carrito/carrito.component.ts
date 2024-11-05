import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component.js';
import { FooterComponent } from '../footer/footer/footer.component.js';
import { UserFormComponent } from '../user-form/user-form.component.js';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [NavbarComponent, FooterComponent,UserFormComponent],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {

}