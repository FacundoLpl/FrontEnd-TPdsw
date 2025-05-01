import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../components/navbar/navbar.component.js';
import { FooterComponent } from '../components/footer/footer/footer.component.js';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../services/reservation.service.js';
import { ListaReservasComponent } from '../components/lista-reservas/lista-reservas.component';
import { AuthService } from '../core/services/auth.service.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, ReactiveFormsModule, CommonModule, ListaReservasComponent],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent {
  people: number;
  datetime: string;
  reservaForm: FormGroup;
  minFecha: string;
  maxFecha: string;
  token: any;
  pendingReservation:any;
  noTieneReserva: boolean = false
  constructor(private fb: FormBuilder, private ReservationService: ReservationService, private AuthService: AuthService, private router:Router) {
    const hoy = new Date();
    this.minFecha = this.formatFecha(hoy); // Fecha actual
    this.maxFecha = this.formatFecha(new Date(hoy.setDate(hoy.getDate() + 7))); // 7 días después

    // Configurar el formulario reactivo con validaciones
    this.reservaForm = this.fb.group({
      fecha: [this.minFecha, Validators.required],
      hora: ['', Validators.required],
      personas: ['', [Validators.required, Validators.min(1)]]
    });
  }

  // Formatear fecha en formato YYYY-MM-DD
  formatFecha(fecha: Date): string {
    return fecha.toISOString().split('T')[0];
  }

  getErrorMessage(campo: string): string {
    const control = this.reservaForm.get(campo);
    if (control?.hasError('required')) return 'Este campo es obligatorio';
    if (control?.hasError('email')) return 'Debe ser un email válido';
    if (control?.hasError('minlength')) return 'Debe tener al menos 3 caracteres';
    if (control?.hasError('pattern')) return 'Formato no válido';
    if (control?.hasError('min')) return 'Debe ser mayor a 0';
    return '';
  }

  onSubmit(): void {
    if (this.reservaForm.valid) {
      console.log('Datos del formulario:', this.reservaForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }

  addReservation(): void {
   // const user = '672d4f6cb48ca087afa73e84';
    const userId = this.AuthService.getId();
    const isValidated = this.AuthService.isAuthenticated()
    if (!isValidated || !userId) {
      console.error("Por favor inicia sesión para continuar.");
      alert("Por favor inicia sesión para continuar.")
      this.router.navigate(['/login']);
      return;
    }
  
      const user = userId
    const people = this.reservaForm.value.personas;

    const fecha = this.reservaForm.value.fecha;
    const hora = this.reservaForm.value.hora;

    const datetimeLocal = new Date(`${fecha}T${hora}:00`);
const datetimeUTC = datetimeLocal.toISOString();


    this.ReservationService.addReservation(user, people, datetimeUTC).subscribe({
      next: (response) => {
        alert(`✅ Reserva creada:\nUsuario: ${user}\nPersonas: ${people}\nFecha y hora (UTC): ${datetimeUTC}`);
        console.log('Reserva creada con éxito:', response);
        this.router.navigate(['/']);

        this.reservaForm.reset({
          fecha: this.minFecha,
          hora: '',
          personas: ''
        });
      },
      error: (error) => {
        console.error('Error al crear la reserva:', error);
        alert('⚠️ No se pudo crear la reserva. Es posible que ya tengas una pendiente.');
      }
    });
  
}

buscarPendiente() {
  this.ReservationService.findOne().subscribe({
    next: (reservation) => {
      if (reservation) {
        this.pendingReservation = {
          date: new Date(reservation.datetime).toLocaleDateString(),
          time: new Date(reservation.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          people: reservation.people,
          userFullName: `${reservation.user.firstName} ${reservation.user.lastName}`,
        };

      } else {
        this.noTieneReserva = true
        this.pendingReservation = null;
      }
    },
    error: (err) => {
      console.error(err.message);
      alert(err.message); // o mostrarlo en un toast
    }
  });
}


}
