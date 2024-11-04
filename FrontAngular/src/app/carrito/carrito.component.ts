import { Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component.js';
import { FooterComponent } from '../components/footer/footer/footer.component.js';
import { UserFormComponent } from '../components/user-form/user-form.component.js';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [NavbarComponent, FooterComponent,UserFormComponent],
  templateUrl: 'src/app/carrito/carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {

}