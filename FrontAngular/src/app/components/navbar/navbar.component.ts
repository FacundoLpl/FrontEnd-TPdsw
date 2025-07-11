import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { AuthService } from "../../core/services/auth.service"

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent {
  isMenuOpen = false
  showUserDropdown = false
  constructor(public authService: AuthService) {}

  
  toggleUserDropdown(): void {
  this.showUserDropdown = !this.showUserDropdown;
}

  logout(): void {
    this.authService.logout()
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.showUserDropdown = false; // cerrar dropdown si cierro menú
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false
    
  }

getUserName(): string {
  const userInfo = this.authService.getUserInfo();
  if (userInfo?.email) {
    return userInfo.email;
  }
  // Si no hay email, mostrar nombre o fallback
  return userInfo?.firstName || "Usuario";
}

  getUserRole(): string {
    return this.authService.getUserRole() || ""
  }
}
