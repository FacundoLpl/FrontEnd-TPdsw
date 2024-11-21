import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../components/navbar/navbar.component.js';
import { FooterComponent } from '../components/footer/footer/footer.component.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent {
  reservaForm: FormGroup;
  constructor(private fb: FormBuilder) { 
    // Configurar el formulario reactivo con validaciones
    this.reservaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]], // Validar número
      email: ['', [Validators.required, Validators.email]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      personas: ['', [Validators.required, Validators.min(1)]],
      mensaje: [''] // Campo opcional
    });
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
}
