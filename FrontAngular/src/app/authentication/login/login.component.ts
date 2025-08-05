import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule,  ActivatedRoute,  Router } from "@angular/router"
import { NavbarComponent } from "../../components/navbar/navbar.component"
import { FooterComponent } from "../../components/footer/footer/footer.component"
import { AuthService } from "../../core/services/auth.service"
import { NotificationService } from "../../services/notification.service"


@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  user = ""
  password = ""
  isLoading = false
  feedback = true
  errorMessage = ""
  showPassword = false
  returnUrl = "/inicio" // Default return URL

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

ngOnInit(): void {
  this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/inicio"
  this.authService.logout();
}
  login(): void {
    if (!this.user || !this.password) {
      this.feedback = false
      this.errorMessage = "Por favor completa todos los campos"
      return
    }

    this.isLoading = true
    this.feedback = true


    this.authService.login({ email: this.user, password: this.password }).subscribe({
      next: (response) => {
        // console.log("Login response received:", response)
        this.isLoading = false

        if (response.error) {
          this.feedback = false
          this.errorMessage = response.message || "Error en el inicio de sesión"
          this.notificationService.error(this.errorMessage)
          return
        }

        // Checkear si la respuesta contiene un token
        if (!response.token) {
          this.feedback = false
          this.errorMessage = "Respuesta de inicio de sesión inválida"
          this.notificationService.error(this.errorMessage)
          return
        }

        this.notificationService.success("¡Bienvenido de vuelta!")

        // Navega a la URL de retorno si está definida
        if (this.returnUrl && this.returnUrl !== "/inicio") {
          this.router.navigateByUrl(this.returnUrl)
        } else {
          // El AuthService maneja automáticamente la redirección según el rol
          this.authService.redirectByRole()
        }
      },
      error: (err) => {
        console.error("Login error in component:", err)
        this.isLoading = false
        this.feedback = false

        // Manejo de errores más específico
        if (err.status === 401) {
          this.errorMessage = "Email o contraseña incorrectos"
        } else if (err.status === 403) {
          this.errorMessage = "Cuenta desactivada. Contacta al administrador"
        } else if (err.status === 404) {
          this.errorMessage = "Servicio de autenticación no disponible"
        } else if (err.status === 0) {
          this.errorMessage = "Error de conexión. Verifica tu internet"
        } else {
          this.errorMessage = "Error del servidor. Intenta más tarde"
        }

        this.notificationService.error(this.errorMessage)
      },
    })
  }
 // Para ver el ojito en el login
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
}
