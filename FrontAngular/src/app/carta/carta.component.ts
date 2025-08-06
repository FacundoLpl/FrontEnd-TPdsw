import { Component, OnInit } from "@angular/core"
import { NavbarComponent } from "../components/navbar/navbar.component"
import { FooterComponent } from "../components/footer/footer/footer.component"
import { MenuItemComponent } from "../components/menu-item/menu-item.component"
import { MenuItemModalComponent } from "../components/menu-item-modal/menu-item-modal.component"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { ProductServiceService } from "../services/product-service.service"
import { CartServiceService } from "../services/cart-service.service"
import { AuthService } from "../core/services/auth.service"
import { NotificationService } from "../services/notification.service"
import { MenuReviewModalComponent } from "../components/menu-review-modal/menu-review-modal.component" 
interface Product {
  id: string
  name: string
  imageUrl: string
  price: number
  category: {
    name: string
  }
  featured?: boolean
  description?: string
}

@Component({
  selector: "app-carta",
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent, MenuItemComponent, MenuItemModalComponent, MenuReviewModalComponent],
  templateUrl: "./carta.component.html",
  styleUrl: "./carta.component.css",
})
export class CartaComponent implements OnInit {
  // Propiedades del modal
  isModalOpen = false
  selectedItemTitle = ""
  selectedImageUrl = ""
  selectedProductId = ""
  selectedPrice = 0
  isReviewModalOpen = false
  selectedProductIdForReview = ""
  selectedProductNameForReview = ""
  selectedImageUrlForReview = ""

  // Propiedades de productos
  products: Product[] = []
  filteredProducts: Product[] = []
  categories: string[] = []
  activeCategory = "all"
  searchTerm = ""

  // Estados de UI
  isLoading = true
  loadingError = false
  showSearchSuggestions = false
  popularSearches = ["Pizza", "Pasta", "Ensalada", "Postre", "Bebida"]

  // Datos del pedido
  orderData: { itemTitle: string; price: number; quantity: number; comment: string }

  // Animaciones
  animationDelay = 0.1

  constructor(
    private productService: ProductServiceService,
    private cartService: CartServiceService,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.loadProducts()
    this.initializeAnimations()
  }

  loadProducts() {
    this.isLoading = true
    this.loadingError = false

    this.productService.findAll().subscribe({
      next: (res: any) => {
        this.products = res.data || []

        // Extraer categorías únicas
        const categorySet = new Set<string>()
        this.products.forEach((product) => {
          if (product.category && product.category.name) {
            categorySet.add(product.category.name)
          }
        })
        this.categories = Array.from(categorySet)

        // Aplicar filtros iniciales
        this.filterProducts()
        this.isLoading = false
      },
      error: (err) => {
        console.error("Error cargando productos:", err)
        this.loadingError = true
        this.isLoading = false
        this.notificationService.error("Error al cargar el menú. Por favor, intenta nuevamente.")
      },
    })
  }

  filterProducts() {
    // Filtrar por categoría
    let filtered =
      this.activeCategory === "all"
        ? [...this.products]
        : this.products.filter((p) => p.category.name === this.activeCategory)

    // Filtrar por término de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(term) || (p.description && p.description.toLowerCase().includes(term)),
      )
    }

    this.filteredProducts = filtered
  }

  setActiveCategory(category: string) {
    this.activeCategory = category
    this.filterProducts()
    this.animateProducts()
  }

  clearSearch() {
    this.searchTerm = ""
    this.filterProducts()
    this.showSearchSuggestions = false
  }

  openModal(itemTitle: string, imageUrl: string, productId: string, price: number) {
    this.selectedItemTitle = itemTitle
    this.selectedImageUrl = imageUrl
    this.selectedProductId = productId
    this.selectedPrice = price
    this.isModalOpen = true
  }

  closeModal() {
    this.isModalOpen = false
  }

  handleOrderAdded(order: { itemTitle: string; price: number; quantity: number; comment: string }) {
    this.orderData = order
  }

  // Método para agregar rápidamente al carrito sin abrir el modal
  quickAddToCart(productId: string, productName: string, price: number) {
    const userId = this.authService.getId()
    if (!userId) {
      this.notificationService.error("Debes iniciar sesión para agregar productos al carrito")
      return
    }

    // Crear el objeto de pedido con valores predeterminados
    const orderData = {
      productName: productName,
      quantity: "1", // Cantidad predeterminada
      subtotal: price,
      comment: undefined, // Sin comentarios
      product: productId,
    }

    // Usar el método del servicio
    this.cartService.addOrderToCart(orderData).subscribe({
      next: (response: any) => {
        if (response.error) {
          this.notificationService.error("Error: " + response.error)
        } else {
          this.notificationService.success(`¡${productName} agregado al carrito!`)
        }
      },
      error: (err: any) => {
        console.error("Error adding order", err)
        this.notificationService.error("Error al agregar el producto al carrito")
      },
    })
  }

  // Método para aplicar sugerencia de búsqueda
  applySearchSuggestion(suggestion: string) {
    this.searchTerm = suggestion
    this.filterProducts()
    this.showSearchSuggestions = false
  }

  // Método para mostrar/ocultar sugerencias
  toggleSearchSuggestions() {
    this.showSearchSuggestions = !this.showSearchSuggestions
  }

  // Método para inicializar animaciones
  initializeAnimations() {
    setTimeout(() => {
      this.animateProducts()
    }, 100)
  }

  // Método para animar productos al cargar o filtrar
  animateProducts() {
    const productCards = document.querySelectorAll(".menu-item-card")
    productCards.forEach((card, index) => {
      const element = card as HTMLElement
      element.style.opacity = "0"
      element.style.transform = "translateY(20px)"

      setTimeout(() => {
        element.style.opacity = "1"
        element.style.transform = "translateY(0)"
      }, index * 50)
    })
  }

  // Método para obtener el color de categoría
  getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      Entradas: "category-entradas",
      "Platos Principales": "category-principales",
      Postres: "category-postres",
      Bebidas: "category-bebidas",
      Pizzas: "category-pizzas",
      Pastas: "category-pastas",
      Ensaladas: "category-ensaladas",
    }

    return colors[category] || "category-default"
  }

  // Método para obtener el ícono de categoría
  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      Entradas: "utensils",
      "Platos Principales": "drumstick-bite",
      Postres: "ice-cream",
      Bebidas: "glass-martini-alt",
      Pizzas: "pizza-slice",
      Pastas: "bread-slice",
      Ensaladas: "leaf",
    }

    return icons[category] || "utensils"
  }

  // Método para obtener el delay de animación
  getAnimationDelay(index: number): string {
    return `${index * 0.05}s`
  }
  VerResenas(productId: string) {
  const product = this.products.find((p) => p.id === productId)
  if (!product) return

  this.selectedProductIdForReview = product.id
  this.selectedProductNameForReview = product.name
  this.selectedImageUrlForReview = product.imageUrl
  this.isReviewModalOpen = true
}
  closeReviewModal() {
  this.isReviewModalOpen = false
}

}
