import { Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component.js';
import { FooterComponent } from '../components/footer/footer/footer.component.js';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export class ReservaComponent {

}
