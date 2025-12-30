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
  totalPendingCarts: number
  totalCompletedCarts: number
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
    totalPendingCarts: 0,
    totalCompletedCarts: 0,
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
  carts: any[] = []
  filteredOrders: any[] = []
  filteredCarts: any[] = []
  orderSearchTerm = ""
  orderStatusFilter = "all"

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

// Pedido seleccionado
selectedCart: any = {};
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
  selectedCategory: any = { id: null, name: '' };
  

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
      this.notificationService.error("Acceso denegado: Se requiere rol de administrador")
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

    // Cargar usuarios
    this.loadUsers()

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
        this.loadUsers() 
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
  this.isLoading = true;

  forkJoin({
    totalPendingCarts: this.cartService.getTotalCarts({ state: 'Pending' }),
    totalCompletedCarts: this.cartService.getTotalCarts({ state: 'Completed' }),
    totalRevenue: this.cartService.getTotalRevenue(),
    totalProducts: this.productService.findAll(),
    totalUsers: this.userFormService.getAllUsers(),
    pendingCarts: this.cartService.getAllCarts({ state: 'Pending' })
  }).subscribe({
    next: (res: any) => {
      console.log('loadStats results:', res);
      this.stats = {
        totalPendingCarts: res.totalPendingCarts?.totalCarts || 1,
        totalCompletedCarts: res.totalCompletedCarts?.totalCarts || 2,
        totalRevenue: res.totalRevenue?.totalRevenue || 0,
        totalProducts: res.totalProducts?.data?.length || 0,
        totalUsers: res.totalUsers?.data?.length || 0,
        pendingOrders: res.pendingCarts?.data?.length || 0   
      };
      this.isLoading = false;
    },
    error: (err) => {
      this.notificationService.error('Error cargando estadísticas');
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
        this.notificationService.error("Error al cargar productos")
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
    this.userFormService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.data || []
        this.filterUsers()
        this.isLoading = false
      },
      error: (err: any) => {
        this.notificationService.error("Error al cargar usuarios")
        console.error(err)
        this.isLoading = false
      },
    })
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

    this.cartService.getAllCarts().subscribe({
      next: (res: any) => {
        this.orders = res.data || []
        this.filterOrders()
        this.isLoading = false
      },
      error: (err: any) => {
        this.notificationService.error("Error al cargar pedidos")
        console.error(err)
        this.isLoading = false
      },
    })
  }
// ver pedido seleccionado
viewCartDetails(cart: any): void {
  this.selectedCart = { ...cart };
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
        this.notificationService.error("Error al cargar categorías");
        console.error(err);
        this.isLoading = false;
      },
    })
  }
  // Crear nuevo usuario (implementar cuando tengamos el servicio correcto)
  createUser(): void {
  this.isLoading = true;
    console.log(this.newUser)
  this.userFormService.createUser(this.newUser).subscribe({
    next: (createdUser) => {
      // Si tu API devuelve el usuario creado:
      this.users.push(createdUser);
      this.filterUsers();
      this.resetNewUser();
      this.notificationService.success("Usuario creado exitosamente");
    },
    error: (err) => {
      console.error("Error al crear usuario:", err);
      this.notificationService.error(err.error?.message || "Ocurrió un error al crear el usuario");
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}
selectedUser: any = {}; // Usuario que se está editando

updateUser(user: any): void {
  // Clonamos para no modificar directamente la lista antes de guardar
  this.selectedUser = { ...user };
}

saveUpdatedUser(): void {
  this.isLoading = true;
  this.userFormService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
    next: (updatedUser) => {
      // Reemplazar en el array local
      this.users = this.users.map(u => u.id === updatedUser.id ? updatedUser : u);
      this.filterUsers();
      this.notificationService.success("Usuario actualizado exitosamente");
    },
    error: (err) => {
      console.error("Error al actualizar usuario:", err);
      this.notificationService.error(err.error?.message || "Ocurrió un error al actualizar");
    },
    complete: () => {
      this.isLoading = false;
    }
  });
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

        this.notificationService.success("Categoría creada exitosamente");
      },
      error: (err: any) => {
        this.notificationService.error("Error al crear categoría");
        console.error(err);
        this.isLoading = false;
      },
    })
  }

  // Resetear formulario de nueva categoría
  resetNewCategory(): void {
    this.newCategory = {
      name: "",
    }
  }
openEditCategoryModal(category: any) {
  this.selectedCategory = { ...category }; // Clonamos para no tocar el original hasta guardar
}

updateCategory() {
  this.productService.updateCategory(this.selectedCategory.id, { name: this.selectedCategory.name })
    .subscribe(() => {
      this.loadCategories(); // Refrescar lista
    });
}


 deleteUser(id: string): void {
  if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
    this.isLoading = true;

    this.userFormService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== id);
        this.filteredUsers = this.filteredUsers.filter((u) => u.id !== id);
        this.notificationService.success("Usuario eliminado exitosamente");
      },
      error: (err) => {
        console.error("Error al eliminar usuario:", err);
        this.notificationService.error(err.error?.message || "Ocurrió un error al eliminar el usuario");
      },
      complete: () => {
        this.isLoading = false;
      }
    });
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
          this.notificationService.success("Categoría eliminada exitosamente");
        },
        error: (err: any) => {
          this.notificationService.error("Error al eliminar categoría");
          console.error(err);
          this.isLoading = false;
        },
      })
    }
  }

  // Actualizar estado de pedido
  updateCartState(cartId: string, newState: string): void {
    this.isLoading = true

    this.cartService.updateCartState(cartId, newState).subscribe({
      next: () => {
        const cart = this.carts.find((o) => o.id === cartId)
        if (cart) {
          cart.state = newState
        }
        this.isLoading = false
        this.notificationService.success("Estado del pedido actualizado exitosamente");
      },
      error: (err: any) => {
        this.notificationService.error("Error al actualizar estado del pedido");
        console.error(err);
        this.isLoading = false;
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