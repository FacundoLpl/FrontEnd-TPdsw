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

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout()
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen
  }

  closeMenu(): void {
    this.isMenuOpen = false
  }

  getUserName(): string {
    const userInfo = this.authService.getUserInfo()
    return userInfo?.firstName || "Usuario"
  }

  getUserRole(): string {
    return this.authService.getUserRole() || ""
  }
}
