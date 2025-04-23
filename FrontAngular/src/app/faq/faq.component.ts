import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../components/navbar/navbar.component.js';
import { FooterComponent } from "../components/footer/footer/footer.component";

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})


export class FaqComponent {
  
  constructor() { }

  
}
