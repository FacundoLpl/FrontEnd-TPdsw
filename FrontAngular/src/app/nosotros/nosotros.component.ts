import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { NavbarComponent } from "../components/navbar/navbar.component"
import { FooterComponent } from "../components/footer/footer/footer.component"

interface TeamMember {
  name: string
  role: string
  description: string
  skills: string[]
  photo: string
  github?: string
  linkedin?: string
}

interface TechStack {
  name: string
  description: string
  icon: string
}

@Component({
  selector: "app-nosotros",
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: "./nosotros.component.html",
  styleUrls: ["./nosotros.component.css"],
})
export class NosotrosComponent implements OnInit {
  // Datos del equipo de desarrollo
  teamMembers: TeamMember[] = [
    {
      name: "Facundo Cantaberta",
      role: "Full Stack Developer",
      description:
        "Especialista en Angular y Node.js. Responsable del desarrollo del frontend y la integración con APIs.",
      skills: ["Angular", "TypeScript", "CSS"],
      photo: "https://randomuser.me/api/portraits/men/44.jpg",
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
    },
    {
      name: "María Paz Battistoni",
      role: "Backend Developer",
      description:
        "Experta en bases de datos y APIs REST. Encargada de la arquitectura del servidor y la seguridad del sistema.",
      skills: ["Node.js", "MongoDB", "Express"],
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
    },
    {
      name: "Bautista Alfaro",
      role: "UI/UX Designer",
      description:
        "Diseñador especializado en experiencia de usuario. Responsable del diseño visual y la usabilidad del sistema.",
      skills: ["Figma", "CSS", "Design Systems"],
      photo: "https://randomuser.me/api/portraits/men/2.jpg",
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
    },
  ]

  // Stack tecnológico
  techStack: TechStack[] = [
    {
      name: "Angular",
      description: "Framework principal para el frontend",
      icon: "angular",
    },
    {
      name: "TypeScript",
      description: "Lenguaje de programación tipado",
      icon: "typescript",
    },
    {
      name: "Node.js",
      description: "Runtime para el backend",
      icon: "nodejs",
    },
    {
      name: "MongoDB",
      description: "Base de datos NoSQL",
      icon: "mongodb",
    },
  ]

  // Estadísticas del proyecto
  projectStats = {
    developers: 3,
    components: 15,
    modules: 5,
    responsive: 100,
  }

  constructor() {}

  ngOnInit(): void {
    // Inicialización del componente
    this.loadAnimations()
  }

  private loadAnimations(): void {
    // Implementar animaciones de entrada si es necesario
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
        }
      })
    })

    // Observar elementos para animaciones
    const animatedElements = document.querySelectorAll(".story-card, .team-member, .tech-item, .stat-item")
    animatedElements.forEach((el) => observer.observe(el))
  }

  // Método para abrir enlaces externos
  openExternalLink(url: string): void {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  // Método para obtener el año actual
  getCurrentYear(): number {
    return new Date().getFullYear()
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
