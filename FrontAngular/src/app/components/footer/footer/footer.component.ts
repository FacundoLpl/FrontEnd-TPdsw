import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.css",
})
export class FooterComponent {
  currentYear = new Date().getFullYear()

  // Información del restaurante
  restaurantInfo = {
    name: "Bella Vista",
    address: "Av. Principal 123, Ciudad",
    phone: "+54 341 123-4567",
    email: "info@bellavista.com",
    hours: {
      weekdays: "Lun - Vie: 11:00 - 23:00",
      weekends: "Sáb - Dom: 10:00 - 24:00",
    },
  }

  // Redes sociales
  socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/bellavista",
      icon: "facebook",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/bellavista",
      icon: "instagram",
    },
    {
      name: "Twitter",
      url: "https://twitter.com/bellavista",
      icon: "twitter",
    },
  ]

  // Enlaces útiles
  quickLinks = [
    { name: "Inicio", route: "/" },
    { name: "Carta", route: "/carta" },
    { name: "Reservas", route: "/reserva" },
    { name: "Nosotros", route: "/nosotros" },
    { name: "FAQ", route: "/faq" },
  ]
}
