import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer/footer.component.js';
import { NavbarComponent } from '../../components/navbar/navbar.component.js';
import { AuthService } from '../../core/services/auth.service.js';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importa CommonModule para usar ngIf, ngFor, etc.

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FooterComponent,NavbarComponent,CommonModule, FormsModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  user: string = '';
  password: string = '';
  feedback: boolean = true;

  constructor(private authService: AuthService, private router: Router ) {

   } // inyecto el servicio de autenticacion y el router

  login (): void {
    this.authService.login(this.user, this.password).subscribe({
      next: ()=> this.router.navigate(['/']), // si la autenticacion es correcta, redirijo a la pagina de inicio
      error: (err) => {console.error('Login failed', err)
        this.feedback=false
      } // si la autenticacion falla, muestro un error en consola
    })
}
  logout(): void {this.authService.logout()}  
}
