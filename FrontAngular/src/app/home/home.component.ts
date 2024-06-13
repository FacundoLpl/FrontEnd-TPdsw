import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { UserComponent } from '../user/user.component';
import { CartaComponent } from '../carta/carta.component.js';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [UserComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  title = 'FrontAngular';
  username ='Facundo';
}
