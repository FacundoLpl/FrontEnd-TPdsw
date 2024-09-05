import { Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component.js';
import { FooterComponent } from '../components/footer/footer/footer.component.js';
import { UserFormComponent } from '../components/user-form/user-form.component.js';

@Component({
  selector: 'app-carta',
  standalone: true,
  imports: [NavbarComponent, FooterComponent,UserFormComponent],
  templateUrl: './carta.component.html',
  styleUrl: './carta.component.css'
})
export class CartaComponent {

}
