import { Component, OnInit, HostListener  } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CartaComponent } from '../carta/carta.component.js';
import { NavbarComponent } from '../components/navbar/navbar.component.js';
import { FooterComponent } from '../components/footer/footer/footer.component.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit{
  title = 'FrontAngular';
  username ='Facundo';
  constructor() { }

  ngOnInit(): void {
    this.adjustHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.adjustHeight();
  }

  adjustHeight(): void {
    const element = document.getElementById('demo');
    if (element) {
      element.style.width = `${window.innerWidth}px`; // Ajusta el ancho al ancho de la ventana
      element.style.height = '500px'; // Altura fija de 500px
    }

}}