import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { AuthService } from "../core/services/auth.service"
import { ProductServiceService } from "../services/product-service.service"
import { CartServiceService } from "../services/cart-service.service"
import { UserFormService } from "../services/user-form.service"

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalUsers: number
  pendingOrders: number
}

interface ChartData {
  labels: string[]
  data: number[]
}

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  // Estado de la UI
  activeSection = "dashboard"
  isLoading = false
  error: string | null = null

  // Estadísticas del dashboard
  stats: DashboardStats = {
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
  }

  // Datos para gráficos
  salesChart: ChartData = {
    labels: [],
    data: [],
  }

  // Datos de productos
  products: any[] = []
  filteredProducts: any[] = []
  productSearchTerm = ""

  // Datos de usuarios
  users: any[] = []
  filteredUsers: any[] = []
  userSearchTerm = ""
  userTypeFilter = "all"

  // Datos de pedidos
  orders: any[] = []
  filteredOrders: any[] = []
  orderSearchTerm = ""
  orderStatusFilter = "all"

  // Nuevo producto/usuario
  newProduct: any = {
    name: "",
    price: 0,
    category: { id: "", name: "" },
    imageUrl: "",
    description: "",
  }

  newUser: any = {
    firstName: "",
    lastName: "",
    dni: "",
    email: "",
    userType: "Cliente",
    password: "",
  }

  // Categorías
  categories: any[] = []
  newCategory: any = {
    name: "",
  }

  constructor(
    private authService: AuthService,
    private productService: ProductServiceService,
    private cartService: CartServiceService,
    private userFormService: UserFormService, // Cambiado a userFormService
  ) {}

  ngOnInit(): void {
    this.checkAdminAccess()
    this.loadDashboardData()
  }

  // Verificar que el usuario sea administrador
  checkAdminAccess(): void {
    if (!this.authService.isAdmin()) {
      console.error("Acceso denegado: Se requiere rol de administrador")
      this.authService.redirectIfNotAdmin()
    }
  }

  // Cargar datos iniciales del dashboard
  loadDashboardData(): void {
    this.isLoading = true

    // Cargar estadísticas
    this.loadStats()

    // Cargar datos de ventas para el gráfico
    this.loadSalesData()

    // Cargar productos
    this.loadProducts()

    // Cargar usuarios (comentado hasta que tengamos el servicio correcto)
    // this.loadUsers()

    // Cargar pedidos
    this.loadOrders()

    // Cargar categorías
    this.loadCategories()

    this.isLoading = false
  }

  // Cambiar sección activa
  setActiveSection(section: string): void {
    this.activeSection = section

    // Recargar datos según la sección
    switch (section) {
      case "products":
        this.loadProducts()
        break
      case "users":
        // this.loadUsers() // Comentado hasta implementar
        break
      case "orders":
        this.loadOrders()
        break
      case "categories":
        this.loadCategories()
        break
      default:
        this.loadStats()
        this.loadSalesData()
    }
  }

  // Cargar estadísticas generales
  loadStats(): void {
    // Datos de ejemplo por ahora
    this.stats = {
      totalOrders: 156,
      totalRevenue: 8750,
      totalProducts: 48,
      totalUsers: 120,
      pendingOrders: 12,
    }
  }

  // Cargar datos de ventas para el gráfico
  loadSalesData(): void {
    // Datos de ejemplo para el gráfico
    this.salesChart = {
      labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      data: [1200, 1900, 1500, 2000, 2400, 3100, 2800],
    }
  }

  // Cargar productos
  loadProducts(): void {
    this.isLoading = true

    this.productService.findAll().subscribe({
      next: (res: any) => {
        this.products = res.data || []
        this.filteredProducts = [...this.products]
        this.isLoading = false
      },
      error: (err: any) => {
        this.error = "Error al cargar productos"
        console.error(err)
        this.isLoading = false
      },
    })
  }

  // Filtrar productos
  filterProducts(): void {
    if (!this.productSearchTerm.trim()) {
      this.filteredProducts = [...this.products]
      return
    }

    const term = this.productSearchTerm.toLowerCase()
    this.filteredProducts = this.products.filter(
      (p) => p.name.toLowerCase().includes(term) || p.category?.name?.toLowerCase().includes(term),
    )
  }

  // Cargar usuarios (implementar cuando tengamos el servicio correcto)
  loadUsers(): void {
    this.isLoading = true

    // Por ahora, datos de ejemplo
    this.users = [
      {
        id: "1",
        firstName: "Juan",
        lastName: "Pérez",
        dni: "12345678",
        email: "juan@example.com",
        userType: "Cliente",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        firstName: "María",
        lastName: "García",
        dni: "87654321",
        email: "maria@example.com",
        userType: "Mozo",
        createdAt: new Date().toISOString(),
      },
    ]

    this.filterUsers()
    this.isLoading = false
  }

  // Filtrar usuarios
  filterUsers(): void {
    let filtered = [...this.users]

    // Filtrar por tipo de usuario
    if (this.userTypeFilter !== "all") {
      filtered = filtered.filter((u) => u.userType === this.userTypeFilter)
    }

    // Filtrar por término de búsqueda
    if (this.userSearchTerm.trim()) {
      const term = this.userSearchTerm.toLowerCase()
      filtered = filtered.filter(
        (u) =>
          u.firstName?.toLowerCase().includes(term) ||
          u.lastName?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term),
      )
    }

    this.filteredUsers = filtered
  }

  // Cargar pedidos
  loadOrders(): void {
    this.isLoading = true

    this.cartService.getAllOrders().subscribe({
      next: (res: any) => {
        this.orders = res.data || []
        this.filterOrders()
        this.isLoading = false
      },
      error: (err: any) => {
        this.error = "Error al cargar pedidos"
        console.error(err)
        this.isLoading = false
      },
    })
  }

  // Filtrar pedidos
  filterOrders(): void {
    let filtered = [...this.orders]

    // Filtrar por estado
    if (this.orderStatusFilter !== "all") {
      filtered = filtered.filter((o) => o.state === this.orderStatusFilter)
    }

    // Filtrar por término de búsqueda
    if (this.orderSearchTerm.trim()) {
      const term = this.orderSearchTerm.toLowerCase()
      filtered = filtered.filter(
        (o) => o.id?.toLowerCase().includes(term) || o.user?.firstName?.toLowerCase().includes(term),
      )
    }

    this.filteredOrders = filtered
  }

  // Cargar categorías
  loadCategories(): void {
    this.isLoading = true

    this.productService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data || []
        this.isLoading = false
      },
      error: (err: any) => {
        this.error = "Error al cargar categorías"
        console.error(err)
        this.isLoading = false
      },
    })
  }

  // Crear nuevo producto
  createProduct(): void {
    this.isLoading = true

    this.productService.createProduct(this.newProduct).subscribe({
      next: (res: any) => {
        this.products.push(res.data)
        this.filteredProducts = [...this.products]
        this.resetNewProduct()
        this.isLoading = false
        alert("Producto creado exitosamente")
      },
      error: (err: any) => {
        this.error = "Error al crear producto"
        console.error(err)
        this.isLoading = false
      },
    })
  }

  // Resetear formulario de nuevo producto
  resetNewProduct(): void {
    this.newProduct = {
      name: "",
      price: 0,
      category: { id: "", name: "" },
      imageUrl: "",
      description: "",
    }
  }

  // Crear nuevo usuario (implementar cuando tengamos el servicio correcto)
  createUser(): void {
    this.isLoading = true

    // Por ahora, simular creación
    const newUser = {
      ...this.newUser,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    this.users.push(newUser)
    this.filterUsers()
    this.resetNewUser()
    this.isLoading = false
    alert("Usuario creado exitosamente")
  }

  // Resetear formulario de nuevo usuario
  resetNewUser(): void {
    this.newUser = {
      firstName: "",
      lastName: "",
      dni: "",
      email: "",
      userType: "Cliente",
      password: "",
    }
  }

  // Crear nueva categoría
  createCategory(): void {
    this.isLoading = true

    this.productService.createCategory(this.newCategory).subscribe({
      next: (res: any) => {
        this.categories.push(res.data)
        this.resetNewCategory()
        this.isLoading = false
        alert("Categoría creada exitosamente")
      },
      error: (err: any) => {
        this.error = "Error al crear categoría"
        console.error(err)
        this.isLoading = false
      },
    })
  }

  // Resetear formulario de nueva categoría
  resetNewCategory(): void {
    this.newCategory = {
      name: "",
    }
  }

  // Eliminar producto
  deleteProduct(id: string): void {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      this.isLoading = true

      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter((p) => p.id !== id)
          this.filteredProducts = this.filteredProducts.filter((p) => p.id !== id)
          this.isLoading = false
          alert("Producto eliminado exitosamente")
        },
        error: (err: any) => {
          this.error = "Error al eliminar producto"
          console.error(err)
          this.isLoading = false
        },
      })
    }
  }

  // Eliminar usuario (implementar cuando tengamos el servicio correcto)
  deleteUser(id: string): void {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      this.users = this.users.filter((u) => u.id !== id)
      this.filteredUsers = this.filteredUsers.filter((u) => u.id !== id)
      alert("Usuario eliminado exitosamente")
    }
  }

  // Eliminar categoría
  deleteCategory(id: string): void {
    if (confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      this.isLoading = true

      this.productService.deleteCategory(id).subscribe({
        next: () => {
          this.categories = this.categories.filter((c) => c.id !== id)
          this.isLoading = false
          alert("Categoría eliminada exitosamente")
        },
        error: (err: any) => {
          this.error = "Error al eliminar categoría"
          console.error(err)
          this.isLoading = false
        },
      })
    }
  }

  // Actualizar estado de pedido
  updateOrderStatus(orderId: string, newStatus: string): void {
    this.isLoading = true

    this.cartService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        const order = this.orders.find((o) => o.id === orderId)
        if (order) {
          order.state = newStatus
        }
        this.isLoading = false
        alert("Estado del pedido actualizado exitosamente")
      },
      error: (err: any) => {
        this.error = "Error al actualizar estado del pedido"
        console.error(err)
        this.isLoading = false
      },
    })
  }

  // Cerrar sesión
  logout(): void {
    this.authService.logout()
  }

  // Obtener nombre completo del usuario
  getUserFullName(user: any): string {
    if (!user) return "Usuario Desconocido"
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Sin nombre"
  }
}
