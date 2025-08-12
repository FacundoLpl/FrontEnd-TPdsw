import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { NavbarComponent } from "../navbar/navbar.component"
import { FooterComponent } from "../footer/footer/footer.component"

interface FaqItem {
  id: number
  question: string
  answer: string | string[]
  category: string
  icon: string
  color: string
  isList?: boolean
  isPopular?: boolean
}

interface Category {
  id: string
  name: string
  icon: string
  count: number
}

@Component({
  selector: "app-faq",
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.css"],
})
export class FaqComponent implements OnInit {
  searchTerm = ""
  selectedCategory = "all"
  showSearchResults = false

  categories: Category[] = [
    { id: "all", name: "Todas", icon: "🔍", count: 0 },
    { id: "reservas", name: "Reservas", icon: "📅", count: 0 },
    { id: "menu", name: "Menú", icon: "🍽️", count: 0 },
    { id: "horarios", name: "Horarios", icon: "⏰", count: 0 },
    { id: "pagos", name: "Pagos", icon: "💳", count: 0 },
    { id: "delivery", name: "Delivery", icon: "🚚", count: 0 },
    { id: "eventos", name: "Eventos", icon: "🎉", count: 0 },
    { id: "reglas", name: "Reglas", icon: "📋", count: 0 },
  ]

  faqItems: FaqItem[] = [
    {
      id: 1,
      question: "¿Cómo puedo hacer una reserva?",
      answer:
        "Puedes hacer tu reserva a través de nuestra plataforma online, por teléfono o WhatsApp. Solo necesitas seleccionar fecha, hora y número de personas.",
      category: "reservas",
      icon: "📱",
      color: "from-blue-500 to-blue-600",
      isPopular: true,
    },
    {
      id: 2,
      question: "¿Con cuánta anticipación puedo reservar?",
      answer:
        "Aceptamos reservas hasta con 7 días de anticipación. Para eventos especiales, recomendamos reservar con mayor tiempo.",
      category: "reservas",
      icon: "📆",
      color: "from-green-500 to-green-600",
    },
    {
      id: 3,
      question: "¿Qué especialidades tienen?",
      answer: [
        "Parrillada Premium con cortes selectos",
        "Risotto de hongos silvestres",
        "Pasta artesanal hecha en casa",
        "Postres de autor",
        "Carta de vinos premium",
      ],
      category: "menu",
      icon: "⭐",
      color: "from-purple-500 to-purple-600",
      isList: true,
      isPopular: true,
    },
    {
      id: 4,
      question: "¿Cuáles son los horarios de atención?",
      answer: "Estamos abiertos todos los días de 19:00 a 00:00. La cocina cierra a las 23:30.",
      category: "horarios",
      icon: "🕐",
      color: "from-orange-500 to-orange-600",
      isPopular: true,
    },
    {
      id: 5,
      question: "¿Qué métodos de pago aceptan?",
      answer: ["Efectivo", "Tarjetas de crédito y débito", "Transferencias bancarias", "Mercado Pago", "PayPal"],
      category: "pagos",
      icon: "💰",
      color: "from-emerald-500 to-emerald-600",
      isList: true,
    },
    {
      id: 6,
      question: "¿Hacen delivery?",
      answer:
        "Sí, realizamos delivery en un radio de 5km. El tiempo estimado es de 30-45 minutos y el costo varía según la distancia.",
      category: "delivery",
      icon: "🛵",
      color: "from-red-500 to-red-600",
    },
    {
      id: 7,
      question: "¿Puedo cancelar mi reserva?",
      answer:
        "Sí, puedes cancelar hasta 4 horas antes sin penalización. Después de ese tiempo, consulta con nuestro equipo.",
      category: "reservas",
      icon: "❌",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      id: 8,
      question: "¿Tienen opciones vegetarianas?",
      answer:
        "¡Por supuesto! Contamos con una amplia variedad de platos vegetarianos y veganos, claramente identificados en nuestro menú.",
      category: "menu",
      icon: "🥗",
      color: "from-lime-500 to-lime-600",
    },
    {
      id: 9,
      question: "¿Organizan eventos privados?",
      answer:
        "Sí, tenemos un salón privado para hasta 30 personas. Ofrecemos menús especiales y decoración personalizada.",
      category: "eventos",
      icon: "🎊",
      color: "from-pink-500 to-pink-600",
    },
    {
      id: 10,
      question: "¿Cuál es el código de vestimenta?",
      answer: "Recomendamos vestimenta smart casual. No se permite ropa deportiva en horario nocturno.",
      category: "reglas",
      icon: "👔",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      id: 11,
      question: "¿Permiten mascotas?",
      answer: "Sí, permitimos mascotas pequeñas en nuestra terraza exterior, siempre con correa y que sean tranquilas.",
      category: "reglas",
      icon: "🐕",
      color: "from-teal-500 to-teal-600",
    },
    {
      id: 12,
      question: "¿Tienen estacionamiento?",
      answer: "Contamos con estacionamiento propio gratuito para nuestros clientes durante las primeras 3 horas.",
      category: "reglas",
      icon: "🚗",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      id: 13,
      question: "¿Cuánto cuesta el delivery?",
      answer:
        "El costo del delivery varía entre $200 y $500 según la distancia. Pedidos superiores a $3000 tienen envío gratuito.",
      category: "delivery",
      icon: "💵",
      color: "from-amber-500 to-amber-600",
    },
    {
      id: 14,
      question: "¿Pueden adaptar platos por alergias?",
      answer:
        "Absolutamente. Nuestro chef puede adaptar cualquier plato según tus alergias o restricciones alimentarias. Solo avísanos al reservar.",
      category: "menu",
      icon: "⚠️",
      color: "from-rose-500 to-rose-600",
    },
    {
      id: 15,
      question: "¿Qué incluye el menú de eventos?",
      answer: [
        "Entrada de cortesía",
        "Plato principal a elección",
        "Postre especial",
        "Bebidas incluidas",
        "Decoración temática",
        "Servicio personalizado",
      ],
      category: "eventos",
      icon: "🍾",
      color: "from-violet-500 to-violet-600",
      isList: true,
    },
  ]

  filteredItems: FaqItem[] = []
  popularItems: FaqItem[] = []

  ngOnInit(): void {
    this.updateCategoryCounts()
    this.filterItems()
    this.popularItems = this.faqItems.filter((item) => item.isPopular)
  }

  updateCategoryCounts(): void {
    this.categories.forEach((category) => {
      if (category.id === "all") {
        category.count = this.faqItems.length
      } else {
        category.count = this.faqItems.filter((item) => item.category === category.id).length
      }
    })
  }

  filterItems(): void {
    let filtered = this.faqItems

    // Filtrar por categoría
    if (this.selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === this.selectedCategory)
    }

    // Filtrar por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.question.toLowerCase().includes(term) ||
          (typeof item.answer === "string" && item.answer.toLowerCase().includes(term)) ||
          (Array.isArray(item.answer) && item.answer.some((ans) => ans.toLowerCase().includes(term))),
      )
      this.showSearchResults = true
    } else {
      this.showSearchResults = false
    }

    this.filteredItems = filtered
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId
    this.filterItems()
  }

  onSearchChange(): void {
    this.filterItems()
  }

  clearSearch(): void {
    this.searchTerm = ""
    this.filterItems()
  }

  setSearchTerm(term: string): void {
    this.searchTerm = term
    this.onSearchChange()
  }

  resetFilters(): void {
    this.clearSearch()
    this.selectCategory("all")
  }

  // Métodos auxiliares para el template
  getSelectedCategoryInfo(): Category | undefined {
    return this.categories.find((c) => c.id === this.selectedCategory)
  }

  getCardClasses(item: FaqItem): string {
    return `bg-gradient-to-r ${item.color}`
  }

  getAnimationDelay(index: number): string {
    return `${index * 0.1}s`
  }

  // Método para obtener el array de strings de manera segura
  getAnswerArray(answer: string | string[]): string[] {
    return Array.isArray(answer) ? answer : []
  }

  // Método para obtener el string de manera segura
  getAnswerString(answer: string | string[]): string {
    return typeof answer === "string" ? answer : ""
  }
}
