import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { AuthService } from "../../core/services/auth.service"
import { ProductServiceService } from "../../services/product-service.service"
import { CartServiceService } from "../../services/cart-service.service"
import { UserFormService } from "../../services/user-form.service"
import { NotificationService  } from "../../services/notification.service"
import { forkJoin } from 'rxjs';
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
  carts: any[] = []
filteredCarts: any[] = []
cartSearchTerm = ""
cartStatusFilter = "all"
orderSearchTerm = "";
filteredOrders: any[] = [];


  // Nuevo producto/usuario
  newProduct = {
  name: '',
  price: 0,
  stock: 0,
  description: '',
  imageUrl: '',
  state: 'Active',
  category: { id: "", name: "" },
};
// Para manejar el producto que se está editando
editingProduct: any = {
  id: '',
  name: '',
  price: 0,
  stock: 0,
  description: '',
  imageUrl: '',
  state: 'Active',
  category: { id: '', name: '' }
}

showEditModal = false


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
    private userFormService: UserFormService,
    private notificationService: NotificationService,
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

    // Crear nuevo producto
  createProduct(): void {
  this.isLoading = true

  const productToSend = {
    name: this.newProduct.name,
    price: this.newProduct.price,
    stock: this.newProduct.stock,
    description: this.newProduct.description,
    imageUrl: this.newProduct.imageUrl,
    state: this.newProduct.state as "Active" | "Archived",
    category: this.newProduct.category.id,
  }

  this.productService.createProduct(productToSend).subscribe({
    next: (res: any) => {
      this.products.push(res.data)
      this.filteredProducts = [...this.products]
      this.resetNewProduct()
      this.isLoading = false
      this.notificationService.success("Producto creado exitosamente.")
      const closeButton = document.querySelector('#addProductModal .btn-close') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
     },
    error: (err: any) => {
      this.notificationService.error("Error al crear producto: " + (err.error?.message || "Error desconocido"))
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
    stock: 0,
    state: "Active",
    category: { id: "", name: "" },
    imageUrl: "",
    description: "",
  };
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
          this.notificationService.success("Producto eliminado exitosamente")
        },
        error: (err: any) => {
          this.notificationService.error("Error al eliminar producto")
          console.error(err)
          this.isLoading = false
        },
      })
    }
  }

// Abrir modal y cargar datos del producto a editar
openEditModal(product: any): void {
  this.editingProduct = JSON.parse(JSON.stringify(product)) // clonar objeto para evitar mutar original
  this.showEditModal = true
}

// Cerrar modal de edición
closeEditModal(): void {
  this.showEditModal = false
}

// Actualizar producto
updateProduct(): void {
  if (!this.editingProduct.name || !this.editingProduct.price || !this.editingProduct.stock || !this.editingProduct.category?.id) {
    alert('Completa todos los campos obligatorios')
    return
  }

  this.isLoading = true

  const productToUpdate = {
    id: this.editingProduct.id,
    name: this.editingProduct.name,
    price: this.editingProduct.price,
    stock: this.editingProduct.stock,
    description: this.editingProduct.description,
    imageUrl: this.editingProduct.imageUrl,
    state: this.editingProduct.state,
    category: this.editingProduct.category.id,
  }

  this.productService.updateProduct(this.editingProduct.id, productToUpdate).subscribe({
    next: (res: any) => {
      if (!res.error) {
        const index = this.products.findIndex(p => p.id === this.editingProduct.id)
        if (index !== -1) {
          this.products[index] = res.data
          this.filteredProducts = [...this.products]
        }
        this.closeEditModal()
        this.notificationService.success("Producto actualizado exitosamente.")
      } else {
        this.notificationService.error('Error al actualizar producto: ' + res.error)
      }
      this.isLoading = false
    },
    error: (err) => {
      this.notificationService.error('Error al actualizar producto')
      console.error(err)
      this.isLoading = false
    }
  })
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
    //this.loadOrders()

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
     case "carts":
       this.loadCarts()
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
  this.isLoading = true;

  forkJoin({
    totalOrders: this.cartService.getTotalOrders(),
    totalRevenue: this.cartService.getTotalRevenue(),
    totalProducts: this.productService.findAll(),
    totalUsers: this.userFormService.getAllUsers(), // descomentar si tenés este endpoint activo
    pendingOrders: this.cartService.getAllCarts({ state: 'pending' })
  }).subscribe({
    next: (res: any) => {
      console.log('loadStats results:', res);
      this.stats = {
        totalOrders: res.totalOrders?.totalOrders || 0,
        totalRevenue: res.totalRevenue?.totalRevenue || 0,
        totalProducts: res.totalProducts?.data?.length || 0,
        totalUsers: res.totalUsers?.data?.length || 0, 
        pendingOrders: res.pendingOrders?.data?.length || 0
      };
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error cargando estadísticas', err);
      this.isLoading = false;
    }
  });
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
  loadCarts(): void {
  this.isLoading = true
  this.cartService.getAllCarts().subscribe({ // renombrar en el service también si hace falta
    next: (res: any) => {
      console.log('Carts loaded:', res); // ← Añade esto
      console.log('carts up')
      this.carts = res.data || []
      this.filterCarts();
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
  filterCarts(): void {
  let filtered = [...this.carts]
  
  // Filtrar por estado
  if (this.cartStatusFilter !== "all") {
    filtered = filtered.filter((c) => c.state === this.cartStatusFilter)
  }
  
  // Filtrar por término de búsqueda
  if (this.cartSearchTerm.trim()) {
    const term = this.cartSearchTerm.toLowerCase()
    filtered = filtered.filter(
      (c) => c.id?.toLowerCase().includes(term) || 
             this.getUserFullName(c.user).toLowerCase().includes(term)
    )
  }
  
  this.filteredCarts = filtered
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

 // Estado para editar categoría
editingCategory: any = {
  id: '',
  name: ''
};

showEditCategoryModal = false;

// Método para abrir modal y cargar categoría
openEditCategoryModal(category: any): void {
  this.editingCategory = { ...category }; // clonamos para no mutar la original
  this.showEditCategoryModal = true;
}

// Método para cerrar modal edición categoría
closeEditCategoryModal(): void {
  this.showEditCategoryModal = false;
}

// Método para actualizar categoría (ejemplo simple)
updateCategory(): void {
  if (!this.editingCategory.name) {
    alert('El nombre es obligatorio');
    return;
  }
  this.productService.updateCategory(this.editingCategory.id, this.editingCategory).subscribe({
    next: (res: any) => {
      const index = this.categories.findIndex(c => c.id === this.editingCategory.id);
      if (index !== -1) {
        this.categories[index] = res.data;
      }
      this.closeEditCategoryModal();
      alert('Categoría actualizada exitosamente');
    },
    error: (err) => {
      console.error('Error al actualizar categoría', err);
      alert('Error al actualizar categoría');
    }
  });
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
 updateCartStatus(cartId: string, newStatus: string): void {
  this.isLoading = true
  this.cartService.updateCartStatus(cartId, newStatus).subscribe({
    next: () => {
      const cart = this.carts.find((c) => c.id === cartId)
      if (cart) {
        cart.state = newStatus
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
