import { Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component.js';
import { FooterComponent } from "../components/footer/footer/footer.component";

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent {

}
