import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component.js';
import { CartaComponent } from './carta/carta.component.js';
import {FormsModule} from '@angular/forms';
import { FooterComponent } from './components/footer/footer/footer.component.js';
import { NavbarComponent } from './components/navbar/navbar.component.js';
import { UserFormComponent } from './components/user-form/user-form.component.js';
import { CarritoComponent } from './components/carrito/carrito.component.js';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, CartaComponent, RouterModule, FormsModule,NavbarComponent  ,FooterComponent, UserFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'FrontAngular';
  username ='Facundo';
  ngOnInit(): void{}

  signUp(){
    alert('Sign Up');
  }
  }
