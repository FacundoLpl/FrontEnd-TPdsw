import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service'; 
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer/footer.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule,NavbarComponent, FooterComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  userData = {
    firstName: '',
    lastName: '',
    dni: '',
    address: '', 
    email: '',
    password: '',
    
    userType: '', // Asignación fija
  };

  feedback: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.userData.userType = 'Client'; // Asignación fija
    this.authService.register(this.userData).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: any) => {
        console.error('Register failed', err);
        this.feedback = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
// Este componente es responsable de la vista de registro de usuario.