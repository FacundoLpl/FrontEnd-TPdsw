import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { NavbarComponent } from "../components/navbar/navbar.component"
import { FooterComponent } from "../components/footer/footer/footer.component"
import { ListaReservasComponent } from "../components/lista-reservas/lista-reservas.component"
import { ReservationService } from "../services/reservation.service"
import { AuthService } from "../core/services/auth.service"
import { Router } from "@angular/router"
import { NotificationService } from "../services/notification.service.js"

@Component({
  selector: "app-reserva",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent, FooterComponent, ListaReservasComponent],
  templateUrl: "./reserva.component.html",
  styleUrls: ["./reserva.component.css"],
})
export class ReservaComponent implements OnInit {
  // Estado de la UI
  activeSection = "nueva-reserva"
  isLoading = false
  error: string | null = null
  successMessage: string | null = null
  isAuthenticated = false

  // Datos del formulario
  reservaForm: FormGroup
  minFecha: string
  maxFecha: string
  horasDisponibles = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"]

  // Datos de reservas
  pendingReservation: any = null

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
  ) {
    this.initializeDates()
    this.initializeForm()
  }

  getInitials(): string {
    const userInfo = this.authService.getUserInfo()
    if (userInfo && userInfo.firstName) {
      return userInfo.firstName.charAt(0).toUpperCase()
    }
    return "U" // Inicial por defecto si no hay información del usuario
  }

  getFullName(): string {
    const userInfo = this.authService.getUserInfo()
    if (userInfo) {
      return `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim()
    }
    return "Usuario" // Nombre por defecto si no hay información del usuario
  }
  someMethod() {
    const userInfo = this.authService.getUserInfo()
  }

  ngOnInit(): void {
    this.checkAuthenticationStatus()
    if (this.isAuthenticated) {
      this.buscarPendiente()
    }
  }

  private checkAuthenticationStatus(): void {
    this.isAuthenticated = this.authService.isAuthenticated()
    if (!this.isAuthenticated) {
      this.error = "Para hacer una reserva necesitas iniciar sesión. Puedes navegar por el menú sin autenticarte."
    }
  }

  private initializeDates(): void {
    const hoy = new Date()
    this.minFecha = this.formatFecha(hoy)

    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 7)
    this.maxFecha = this.formatFecha(maxDate)
  }

  private initializeForm(): void {
    this.reservaForm = this.fb.group({
      fecha: [this.minFecha, [Validators.required]],
      hora: ["", [Validators.required]],
      personas: ["", [Validators.required, Validators.min(1), Validators.max(8)]],
    })
  }

  // Formatear fecha en formato YYYY-MM-DD
  formatFecha(fecha: Date): string {
    return fecha.toISOString().split("T")[0]
  }

  // Navegación entre secciones
  setActiveSection(section: string): void {
    this.activeSection = section
    this.clearMessages()

    // Verificar autenticación solo cuando sea necesario
    if ((section === "mis-reservas" || section === "nueva-reserva") && !this.isAuthenticated) {
      this.error = "Necesitas iniciar sesión para acceder a esta sección."
      return
    }

    if (section === "mis-reservas" && this.isAuthenticated) {
      this.buscarPendiente()
    }
  }

  // Limpiar mensajes
  clearMessages(): void {
    this.error = null
    this.successMessage = null
  }

  // Obtener mensajes de error
  getErrorMessage(campo: string): string {
    const control = this.reservaForm.get(campo)
    if (control?.hasError("required")) return "Este campo es obligatorio"
    if (control?.hasError("min")) return "Debe ser mayor a 0"
    if (control?.hasError("max")) return "Máximo 8 personas"
    return ""
  }

  // Resetear formulario
  resetForm(): void {
    this.reservaForm.reset({
      fecha: this.minFecha,
      hora: "",
      personas: "",
    })
    this.clearMessages()
  }

  // Envío del formulario
  onSubmit(): void {
    if (!this.isAuthenticated) {
      this.error = "Debes iniciar sesión para hacer una reserva."
      return
    }

    if (this.reservaForm.valid) {
      this.addReservation()
    } else {
      this.error = "Por favor completa todos los campos correctamente"
      this.markFormGroupTouched()
    }

    this.successMessage = 'Reserva creada exitosamente';
    this.setActiveSection('mis-reservas');
  }

  private markFormGroupTouched(): void {
    Object.keys(this.reservaForm.controls).forEach((key) => {
      const control = this.reservaForm.get(key)
      control?.markAsTouched()
    })
  }

  // Crear reserva
addReservation(): void {
  if (!this.isAuthenticated) {
    this.error = "Debes iniciar sesión para hacer una reserva."
    this.redirectToLogin()
    return
  }
  const userId = this.authService.getId()
  if (!userId) {
    this.error = "Error de autenticación. Por favor inicia sesión nuevamente."
    this.redirectToLogin()
    return
  }
  this.isLoading = true
  this.clearMessages()

  const people = this.reservaForm.value.personas
  const fecha = this.reservaForm.value.fecha
  const hora = this.reservaForm.value.hora

  const datetimeString = `${fecha}T${hora}:00`;
 this.reservationService.addReservation(userId, people, datetimeString).subscribe({
  next: (response) => {
    this.isLoading = false

    this.notificationService.success(
      ` Reserva creada exitosamente para ${people} personas el ${this.formatDisplayDate(fecha)} a las ${hora}`
    )

    this.resetForm()
    this.setActiveSection("mis-reservas")

      setTimeout(() => {
        this.successMessage = null
      }, 5000)
    },
    error: (error) => {
      this.isLoading = false
      
      if (error.status === 400) {
        this.error = error.error?.message || "Datos de reserva inválidos"
      } else if (error.status === 409) {
        this.error = "Ya tienes una reserva pendiente o el horario no está disponible"
      } else if (error.status === 401) {
        this.error = "Tu sesión ha expirado. Por favor inicia sesión nuevamente"
        this.redirectToLogin()
      } else {
        this.error = "⚠️ No se pudo crear la reserva. Intenta más tarde o contacta al restaurante."
      }
    },
  })
}

  // Buscar reserva pendiente
  buscarPendiente() {
  if (!this.isAuthenticated) return;
  
  this.isLoading = true;
  
  this.reservationService.getPendingReservation().subscribe({
    next: (response) => {
      this.pendingReservation = response.data;
      this.isLoading = false;
    },
    error: (error) => {
      this.pendingReservation = null;
      this.isLoading = false;
    }
  });
}

  // Cancelar reserva
cancelarReserva(id: string): void {
  if (!id || id === 'undefined' || id === 'null') {
    this.notificationService.error(' ID de reserva inválido');
    return;
  }
  this.isLoading = true;

  this.reservationService.cancelReservation(id).subscribe({
    next: (res) => {
      this.isLoading = false;
      this.pendingReservation = null;
      this.notificationService.success(' Reserva cancelada con éxito');
    },
    error: (err) => {
      this.isLoading = false;
      this.notificationService.error(' Error al cancelar la reserva');
    },
  });
}
  // Redirigir al login
  redirectToLogin(): void {
    setTimeout(() => {
      this.router.navigate(["/login"])
    }, 2000)
  }

  // Métodos auxiliares para el template
  getUserInitial(): string {
    if (!this.isAuthenticated) return "U"

    const userInfo = this.authService.getUserInfo && this.authService.getUserInfo()
    if (userInfo && userInfo.firstName) {
      return userInfo.firstName.charAt(0).toUpperCase()
    }
    return "U"
  }

  getUserName(): string {
    if (!this.isAuthenticated) return "Usuario"

    const userInfo = this.authService.getUserInfo && this.authService.getUserInfo()
    if (userInfo) {
      return `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim()
    }
    return "Usuario"
  }

  formatDisplayDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  logout(): void {
    this.authService.logout()
  }

  // Ir al login
  goToLogin(): void {
    this.router.navigate(["/login"])
  }
// Método temporal para debugging
getObjectKeys(obj: any): string {
  return obj ? Object.keys(obj).join(', ') : 'null';
}
  
}