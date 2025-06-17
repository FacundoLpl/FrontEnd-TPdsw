import { Component, type OnInit, type AfterViewInit, HostListener } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { NavbarComponent } from "../components/navbar/navbar.component"
import { FooterComponent } from "../components/footer/footer/footer.component"

interface ServiceCard {
  title: string
  description: string
  icon: string
  color: string
  route: string
  features: string[]
}

interface FeatureCard {
  title: string
  description: string
  icon: string
  color: string
}

interface MenuItem {
  name: string
  description: string
  price: string
  image: string
  category: string
  featured: boolean
}

interface Testimonial {
  name: string
  role: string
  comment: string
  rating: number
  image: string
}

interface Stat {
  number: string
  label: string
  icon: string
}

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, AfterViewInit {
  // Servicios principales
  mainServices: ServiceCard[] = [
    {
      title: "Reserva tu Mesa",
      description: "Sistema inteligente de reservas online con confirmación instantánea",
      icon: "calendar-check",
      color: "from-blue-500 to-blue-600",
      route: "/reserva",
      features: ["Reserva inmediata", "Selección de mesa", "Confirmación por email", "Cancelación flexible"],
    },
    {
      title: "Delivery Premium",
      description: "Disfruta nuestros platos en casa con entrega rápida y segura",
      icon: "truck-fast",
      color: "from-green-500 to-green-600",
      route: "/delivery",
      features: ["Entrega en 30 min", "Empaque ecológico", "Seguimiento en tiempo real", "Zona de cobertura amplia"],
    },
    {
      title: "Carta Digital",
      description: "Explora nuestro menú completo con descripciones detalladas",
      icon: "utensils",
      color: "from-purple-500 to-purple-600",
      route: "/carta",
      features: ["Menú actualizado", "Filtros por categoría", "Información nutricional", "Opciones especiales"],
    },
    {
      title: "Eventos Privados",
      description: "Organiza celebraciones únicas en nuestros espacios exclusivos",
      icon: "party-horn",
      color: "from-orange-500 to-orange-600",
      route: "/eventos",
      features: ["Salones privados", "Menús personalizados", "Decoración incluida", "Servicio especializado"],
    },
  ]

  // Características del restaurante
  features: FeatureCard[] = [
    {
      title: "Cocina de Autor",
      description: "Platos únicos creados por nuestro chef ejecutivo con ingredientes de primera calidad",
      icon: "chef-hat",
      color: "from-amber-500 to-amber-600",
    },
    {
      title: "Ambiente Único",
      description: "Diseño interior cuidadosamente pensado para crear la atmósfera perfecta",
      icon: "sparkles",
      color: "from-red-500 to-red-600",
    },
    {
      title: "Servicio Excepcional",
      description: "Personal altamente capacitado para brindarte una experiencia memorable",
      icon: "heart",
      color: "from-pink-500 to-pink-600",
    },
    {
      title: "Tecnología Avanzada",
      description: "Sistema integrado para una experiencia fluida desde la reserva hasta el pago",
      icon: "cpu-chip",
      color: "from-indigo-500 to-indigo-600",
    },
  ]

  // Platos destacados
  featuredDishes: MenuItem[] = [
    {
      name: "Parrillada Signature",
      description: "Selección premium de cortes argentinos con guarnición gourmet",
      price: "$3500",
      image: "https://rockandfellers.com.ar/front/images/bg/ryf1.jpg",
      category: "Especialidades",
      featured: true,
    },
    {
      name: "Risotto Trufa Negra",
      description: "Arroz carnaroli con trufa negra, parmesano 24 meses y manteca de hierbas",
      price: "$2800",
      image: "https://rockandfellers.com.ar/front/images/bg/ryf2.jpg",
      category: "Pastas",
      featured: true,
    },
    {
      name: "Salmón Patagónico",
      description: "Filete grillado con reducción de vino blanco y vegetales de estación",
      price: "$3200",
      image: "https://rockandfellers.com.ar/front/images/bg/ryf3.jpg",
      category: "Pescados",
      featured: true,
    },
  ]

  // Testimonios
  testimonials: Testimonial[] = [
    {
      name: "María González",
      role: "Food Blogger",
      comment: "Una experiencia gastronómica excepcional. Cada plato es una obra de arte y el servicio es impecable.",
      rating: 5,
      image: "https://rockandfellers.com.ar/front/images/bg/ryf4.png",
    },
    {
      name: "Carlos Mendoza",
      role: "Chef Consultor",
      comment: "La calidad de los ingredientes y la técnica culinaria están al nivel de los mejores restaurantes.",
      rating: 5,
      image: "https://rockandfellers.com.ar/front/images/bg/ryf4.png",
    },
    {
      name: "Ana Rodríguez",
      role: "Crítica Gastronómica",
      comment: "Un lugar que redefine la experiencia culinaria con innovación y tradición en perfecta armonía.",
      rating: 4,
      image: "https://rockandfellers.com.ar/front/images/bg/ryf4.png",
    },
  ]

  // Estadísticas
  stats: Stat[] = [
    { number: "500+", label: "Clientes Satisfechos", icon: "users" },
    { number: "50+", label: "Platos Únicos", icon: "utensils" },
    { number: "5★", label: "Calificación Promedio", icon: "star" },
    { number: "3", label: "Años de Experiencia", icon: "calendar" },
  ]

  // Horarios
  businessHours = [
    { day: "Lunes - Jueves", hours: "12:00 - 23:00" },
    { day: "Viernes - Sábado", hours: "12:00 - 01:00" },
    { day: "Domingo", hours: "12:00 - 22:00" },
  ]

  constructor() {}

  ngOnInit(): void {
    // Inicialización
  }

  ngAfterViewInit(): void {
    this.initializeAnimations()
  }

  @HostListener("window:scroll", ["$event"])
  onScroll(): void {
    this.handleScrollAnimations()
  }

  private initializeAnimations(): void {
    // Inicializar animaciones de elementos flotantes
    this.animateFloatingElements()
  }

  private animateFloatingElements(): void {
    const shapes = document.querySelectorAll(".floating-shape")
    shapes.forEach((shape, index) => {
      const element = shape as HTMLElement
      element.style.animationDelay = `${index * 0.5}s`
    })
  }

  private handleScrollAnimations(): void {
    const elements = document.querySelectorAll(".animate-on-scroll")
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0

      if (isVisible) {
        element.classList.add("animated")
      }
    })
  }

  // Método para generar array de estrellas
  generateRatingArray(rating: number): number[] {
    return Array(rating).fill(0)
  }

  // Método para scroll suave a secciones
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }
}
