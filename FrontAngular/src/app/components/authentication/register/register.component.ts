import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { NavbarComponent } from "../../navbar/navbar.component"
import { FooterComponent } from "../../footer/footer/footer.component"
import { AuthService } from "../../../core/services/auth.service"
import { NotificationService } from "../../../services/notification.service"
import { Router } from "@angular/router"

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  userData = {
    firstName: "",
    lastName: "",
    dni: "",
    address: "",
    email: "",
    password: "",
    userType: "Client", // Valor por defecto
  }

  feedback = true
  errorMessage = ""
  isLoading = false
  showPassword = false
  acceptTerms = false

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Si el usuario ya está autenticado, redirigir según su rol
    if (this.authService.isAuthenticated()) {
      this.authService.redirectByRole()
    }
  }

  register(): void {
    // Validaciones básicas
    if (!this.validateForm()) {
      return
    }

    if (!this.acceptTerms) {
      this.feedback = false
      this.errorMessage = "Debes aceptar los términos y condiciones"
      this.notificationService.error(this.errorMessage)
      return
    }

    this.isLoading = true
    this.feedback = true

    // En register.component.ts, mejora el manejo de errores:
this.authService.register(this.userData).subscribe({
  next: (response) => {
    this.isLoading = false
    
    // Verificar si realmente fue exitoso
    if (response.error) {
      this.feedback = false
      if (response.errors && Array.isArray(response.errors)) {
        // Mostrar errores específicos de validación
        this.errorMessage = response.errors.map((e: any) => e.message || e).join(', ')
      } else {
        this.errorMessage = response.message || "Error en el registro"
      }
      this.notificationService.error(this.errorMessage)
      return
    }

    this.notificationService.success("¡Cuenta creada exitosamente! Bienvenido a Restaurant DSW")
    
    // Redirigir después del registro exitoso
    setTimeout(() => {
      this.authService.redirectByRole()
    }, 1000);
  },
  error: (err) => {
    console.error("❌ Registration error details:", err)
    this.isLoading = false
    this.feedback = false

    // Manejo de errores más específico
    if (err.status === 400) {
      // Mostrar errores específicos de validación
      if (err.error?.errors && Array.isArray(err.error.errors)) {
        this.errorMessage = err.error.errors.map((e: any) => e.message || e).join(', ')
      } else {
        this.errorMessage = err.error?.message || "Datos inválidos. Verifica la información"
      }
    } else if (err.status === 409) {
      this.errorMessage = "El email o DNI ya está registrado. Intenta con otros datos"
    } else if (err.status === 0) {
      this.errorMessage = "Error de conexión. Verifica tu internet"
    } else {
      this.errorMessage = "Error del servidor. Intenta más tarde"
    }

    this.notificationService.error(this.errorMessage)
  },
})
  }

  validateForm(): boolean {
    // Validar campos requeridos
    if (!this.userData.firstName.trim()) {
      this.feedback = false
      this.errorMessage = "El nombre es requerido"
      this.notificationService.error(this.errorMessage)
      return false
    }

    if (!this.userData.lastName.trim()) {
      this.feedback = false
      this.errorMessage = "El apellido es requerido"
      this.notificationService.error(this.errorMessage)
      return false
    }

    if (!this.userData.dni.trim()) {
      this.feedback = false
      this.errorMessage = "El DNI es requerido"
      this.notificationService.error(this.errorMessage)
      return false
    }

    if (!this.userData.email.trim()) {
      this.feedback = false
      this.errorMessage = "El email es requerido"
      this.notificationService.error(this.errorMessage)
      return false
    }

    if (!this.userData.password.trim()) {
      this.feedback = false
      this.errorMessage = "La contraseña es requerida"
      this.notificationService.error(this.errorMessage)
      return false
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(this.userData.email)) {
      this.feedback = false
      this.errorMessage = "El formato del email no es válido"
      this.notificationService.error(this.errorMessage)
      return false
    }

    // Validar longitud de contraseña
    if (this.userData.password.length < 6) {
      this.feedback = false
      this.errorMessage = "La contraseña debe tener al menos 6 caracteres"
      this.notificationService.error(this.errorMessage)
      return false
    }

    // Validar DNI (solo números)
    const dniRegex = /^\d{7,8}$/
    if (!dniRegex.test(this.userData.dni)) {
      this.feedback = false
      this.errorMessage = "El DNI debe tener 7 u 8 dígitos"
      this.notificationService.error(this.errorMessage)
      return false
    }

    return true
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }

  // Método para limpiar errores cuando el usuario empiece a escribir
  clearError(): void {
    if (!this.feedback) {
      this.feedback = true
      this.errorMessage = ""
    }
  }

  logout(): void {
    this.authService.logout()
  }
}
