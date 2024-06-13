import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component.js';
import { CartaComponent } from './carta/carta.component.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserComponent, HomeComponent, CartaComponent, RouterModule],
  templateUrl: './app.component.html',
  
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FrontAngular';
  username ='Facundo';
  }
