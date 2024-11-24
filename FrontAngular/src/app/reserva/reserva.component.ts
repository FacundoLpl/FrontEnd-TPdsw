import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../components/navbar/navbar.component.js';
import { FooterComponent } from '../components/footer/footer/footer.component.js';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../services/reservation.service.js';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent {
  people: number;
  datetime: string;
  reservaForm: FormGroup;
  minFecha: string;
  maxFecha: string;

  constructor(private fb: FormBuilder, private ReservationService: ReservationService) {
    const hoy = new Date();
    this.minFecha = this.formatFecha(hoy); // Fecha actual
    this.maxFecha = this.formatFecha(new Date(hoy.setDate(hoy.getDate() + 7))); // 7 días después

    // Configurar el formulario reactivo con validaciones
    this.reservaForm = this.fb.group({
      fecha: ['', Validators.required],
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
    const user = '672d4f6cb48ca087afa73e84';
    const people = this.reservaForm.value.personas;

    const fecha = this.reservaForm.value.fecha;
    const hora = this.reservaForm.value.hora;

    const datetimeLocal = new Date(`${fecha}T${hora}:00`);

    const datetimeUTC = new Date(
      datetimeLocal.getTime() - datetimeLocal.getTimezoneOffset() * 60000
    ).toISOString();

    this.ReservationService.addReservation(user, people, datetimeUTC);

    alert(`Reserva creada en UTC: Usuario ${user}, Personas ${people}, Fecha y hora ${datetimeUTC}`);
  }
}
