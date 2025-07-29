import { Injectable } from "@angular/core"
import {HttpClient, HttpParams } from "@angular/common/http"
import {Observable, catchError, of } from "rxjs"
import { Order } from "../entities/order.entity"

export interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
  description?: string
  category: {
    id: string
    name: string
  }
  featured?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  id: string
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateProductDto {
  name: string
  price: number
  stock: number
  state: "Active" | "Archived"
  imageUrl: string
  description?: string
  category: string
  featured?: boolean
}

export interface UpdateProductDto {
  name?: string
  price?: number
  imageUrl?: string
  description?: string
  categoryId?: string
  featured?: boolean
}

export interface CreateCategoryDto {
  name: string
  description?: string
}

@Injectable({
  providedIn: "root",
})
export class ProductServiceService {
  order: Order
  readonly baseUrl = "http://localhost:3000/api/products"
  readonly categoryUrl = "http://localhost:3000/api/categories"

  constructor(private http: HttpClient) {}

  // ========== PRODUCTOS ==========

  /**
   * Obtener todos los productos
   */
  findAll(filter: any = {}): Observable<any> {
    let params = new HttpParams()

    if (filter.category) {
      params = params.set("category", filter.category)
    }
    if (filter.featured !== undefined) {
      params = params.set("featured", filter.featured.toString())
    }
    if (filter.search) {
      params = params.set("search", filter.search)
    }

    return this.http.get(`${this.baseUrl}`, { params }).pipe(
      catchError((err) => {
        console.error("Error fetching products:", err)
        return of({ data: [], error: "Error al cargar productos" })
      }),
    )
  }

  /**
   * Obtener un producto por ID
   */
  findOne(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`).pipe(
      catchError((err) => {
        console.error("Error fetching product:", err)
        return of({ data: null, error: "Error al cargar producto" })
      }),
    )
  }

  /**
   * Crear un nuevo producto
   */
  createProduct(productData: CreateProductDto): Observable<any> {
    return this.http.post(`${this.baseUrl}`, productData).pipe(
      catchError((err) => {
        console.error("Error creating product:", err)
        const backendMessage = err.error?.message || "Error al crear producto"
        return of({ error: backendMessage })
      }),
    )
  }

  /**
   * Actualizar un producto existente
   */
  updateProduct(id: string, productData: UpdateProductDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, productData).pipe(
      catchError((err) => {
        console.error("Error updating product:", err)
        return of({ error: err.error?.message || "Error al actualizar producto" })
      }),
    )
  }

  /**
   * Eliminar un producto
   */
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError((err) => {
        console.error("Error deleting product:", err)
        return of({ error: err.error?.message || "Error al eliminar producto" })
      }),
    )
  }

  /**
   * Obtener productos por categoría
   */
  getProductsByCategory(categoryId: string): Observable<any> {
    return this.findAll({ category: categoryId })
  }

  /**
   * Obtener productos destacados
   */
  getFeaturedProducts(): Observable<any> {
    return this.findAll({ featured: true })
  }

  /**
   * Buscar productos por nombre
   */
  searchProducts(searchTerm: string): Observable<any> {
    return this.findAll({ search: searchTerm })
  }

  // ========== CATEGORÍAS ==========

  /**
   * Obtener todas las categorías
   */
  getCategories(): Observable<any> {
    return this.http.get(`${this.categoryUrl}`).pipe(
      catchError((err) => {
        console.error("Error fetching categories:", err)
        return of({ data: [], error: "Error al cargar categorías" })
      }),
    )
  }

  /**
   * Obtener una categoría por ID
   */
  getCategory(id: string): Observable<any> {
    return this.http.get(`${this.categoryUrl}/${id}`).pipe(
      catchError((err) => {
        console.error("Error fetching category:", err)
        return of({ data: null, error: "Error al cargar categoría" })
      }),
    )
  }

  /**
   * Crear una nueva categoría
   */
  createCategory(categoryData: CreateCategoryDto): Observable<any> {
    return this.http.post(`${this.categoryUrl}`, categoryData).pipe(
      catchError((err) => {
        console.error("Error creating category:", err)
        return of({ error: err.error?.message || "Error al crear categoría" })
      }),
    )
  }

  /**
   * Actualizar una categoría existente
   */
  updateCategory(id: string, categoryData: Partial<CreateCategoryDto>): Observable<any> {
    return this.http.put(`${this.categoryUrl}/${id}`, categoryData).pipe(
      catchError((err) => {
        console.error("Error updating category:", err)
        return of({ error: err.error?.message || "Error al actualizar categoría" })
      }),
    )
  }

  /**
   * Eliminar una categoría
   */
  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.categoryUrl}/${id}`).pipe(
      catchError((err) => {
        console.error("Error deleting category:", err)
        return of({ error: err.error?.message || "Error al eliminar categoría" })
      }),
    )
  }

  // ========== ESTADÍSTICAS (para el dashboard) ==========

  /**
   * Obtener estadísticas de productos
   */
  getProductStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats`).pipe(
      catchError((err) => {
        console.error("Error fetching product stats:", err)
        return of({
          data: {
            totalProducts: 0,
            featuredProducts: 0,
            categoriesCount: 0,
          },
          error: "Error al cargar estadísticas",
        })
      }),
    )
  }

  /**
   * Obtener productos más vendidos
   */
  getTopSellingProducts(limit = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/top-selling?limit=${limit}`).pipe(
      catchError((err) => {
        console.error("Error fetching top selling products:", err)
        return of({ data: [], error: "Error al cargar productos más vendidos" })
      }),
    )
  }

  // ========== UTILIDADES ==========

  /**
   * Subir imagen de producto
   */
  uploadProductImage(file: File): Observable<any> {
    const formData = new FormData()
    formData.append("image", file)

    return this.http.post(`${this.baseUrl}/upload-image`, formData).pipe(
      catchError((err) => {
        console.error("Error uploading image:", err)
        return of({ error: err.error?.message || "Error al subir imagen" })
      }),
    )
  }

  /**
   * Validar disponibilidad de producto
   */
  checkProductAvailability(productId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${productId}/availability`).pipe(
      catchError((err) => {
        console.error("Error checking availability:", err)
        return of({ available: false, error: "Error al verificar disponibilidad" })
      }),
    )
  }
}
