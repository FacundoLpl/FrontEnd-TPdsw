import { Injectable } from "@angular/core"
import {HttpClient, HttpParams } from "@angular/common/http"
import {Observable, catchError, of } from "rxjs"

export interface CreateUserDto {
  firstName: string
  lastName: string
  dni: string
  email: string
  password: string
  userType: "Admin" | "Mozo" | "Cliente"
}

export interface UpdateUserDto {
  firstName?: string
  lastName?: string
  dni?: string
  email?: string
  userType?: "Admin" | "Mozo" | "Cliente"
  isActive?: boolean
}

export interface UserStats {
  totalUsers: number
  adminCount: number
  mozoCount: number
  clienteCount: number
  activeUsers: number
  newUsersThisMonth: number
}

@Injectable({
  providedIn: "root",
})
export class UserFormService {
  private readonly baseUrl = "http://localhost:3000/api/users"

  constructor(private http: HttpClient) {}

  // ========== CRUD BÁSICO ==========

  /**
   * Obtener todos los usuarios con filtros opcionales
   */
  getAllUsers(filter: any = {}): Observable<any> {
    let params = new HttpParams()

    if (filter.userType) {
      params = params.set("userType", filter.userType)
    }
    if (filter.isActive !== undefined) {
      params = params.set("isActive", filter.isActive.toString())
    }
    if (filter.search) {
      params = params.set("search", filter.search)
    }
    if (filter.page) {
      params = params.set("page", filter.page.toString())
    }
    if (filter.limit) {
      params = params.set("limit", filter.limit.toString())
    }

    return this.http.get(`${this.baseUrl}`, { params }).pipe(
      catchError((err) => {
        console.error("Error fetching users:", err)
        return of({ data: [], error: "Error al cargar usuarios" })
      }),
    )
  }

  /**
   * Obtener un usuario por ID
   */
  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`).pipe(
      catchError((err) => {
        console.error("Error fetching user:", err)
        return of({ data: null, error: "Error al cargar usuario" })
      }),
    )
  }

  /**
   * Crear un nuevo usuario
   */
  createUser(userData: CreateUserDto): Observable<any> {
    return this.http.post(`${this.baseUrl}`, userData).pipe(
      catchError((err) => {
        console.error("Error creating user:", err)
        return of({ error: err.error?.message || "Error al crear usuario" })
      }),
    )
  }

  /**
   * Actualizar un usuario existente
   */
  updateUser(id: string, userData: UpdateUserDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, userData).pipe(
      catchError((err) => {
        console.error("Error updating user:", err)
        return of({ error: err.error?.message || "Error al actualizar usuario" })
      }),
    )
  }

  /**
   * Eliminar un usuario
   */
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError((err) => {
        console.error("Error deleting user:", err)
        return of({ error: err.error?.message || "Error al eliminar usuario" })
      }),
    )
  }

  // ========== MÉTODOS ESPECÍFICOS POR ROL ==========

  /**
   * Obtener todos los administradores
   */
  getAdmins(): Observable<any> {
    return this.getAllUsers({ userType: "Admin" })
  }

  /**
   * Obtener todos los mozos
   */
  getMozos(): Observable<any> {
    return this.getAllUsers({ userType: "Mozo" })
  }

  /**
   * Obtener todos los clientes
   */
  getClientes(): Observable<any> {
    return this.getAllUsers({ userType: "Cliente" })
  }

  /**
   * Obtener usuarios activos
   */
  getActiveUsers(): Observable<any> {
    return this.getAllUsers({ isActive: true })
  }

  // ========== GESTIÓN DE ESTADO ==========

  /**
   * Activar un usuario
   */
  activateUser(id: string): Observable<any> {
    return this.updateUser(id, { isActive: true })
  }

  /**
   * Desactivar un usuario
   */
  deactivateUser(id: string): Observable<any> {
    return this.updateUser(id, { isActive: false })
  }

  /**
   * Cambiar tipo de usuario
   */
  changeUserType(id: string, newType: "Admin" | "Mozo" | "Cliente"): Observable<any> {
    return this.updateUser(id, { userType: newType })
  }

  // ========== ESTADÍSTICAS ==========

  /**
   * Obtener estadísticas de usuarios
   */
  getUserStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats`).pipe(
      catchError((err) => {
        console.error("Error fetching user stats:", err)
        return of({
          data: {
            totalUsers: 0,
            adminCount: 0,
            mozoCount: 0,
            clienteCount: 0,
            activeUsers: 0,
            newUsersThisMonth: 0,
          },
          error: "Error al cargar estadísticas de usuarios",
        })
      }),
    )
  }

  /**
   * Obtener usuarios registrados recientemente
   */
  getRecentUsers(limit = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/recent?limit=${limit}`).pipe(
      catchError((err) => {
        console.error("Error fetching recent users:", err)
        return of({ data: [], error: "Error al cargar usuarios recientes" })
      }),
    )
  }

  // ========== BÚSQUEDA Y FILTROS ==========

  /**
   * Buscar usuarios por nombre o email
   */
  searchUsers(searchTerm: string): Observable<any> {
    return this.getAllUsers({ search: searchTerm })
  }

  /**
   * Obtener usuarios por tipo con paginación
   */
  getUsersByType(userType: "Admin" | "Mozo" | "Cliente", page = 1, limit = 10): Observable<any> {
    return this.getAllUsers({ userType, page, limit })
  }

  // ========== VALIDACIONES ==========

  /**
   * Verificar si un email ya existe
   */
  checkEmailExists(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/check-email?email=${email}`).pipe(
      catchError((err) => {
        console.error("Error checking email:", err)
        return of({ exists: false, error: "Error al verificar email" })
      }),
    )
  }

  // ========== GESTIÓN DE PERFIL ==========

  /**
   * Actualizar perfil de usuario
   */
  updateProfile(id: string, profileData: Partial<UpdateUserDto>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/profile`, profileData).pipe(
      catchError((err) => {
        console.error("Error updating profile:", err)
        return of({ error: err.error?.message || "Error al actualizar perfil" })
      }),
    )
  }

  /**
   * Cambiar contraseña de usuario
   */
  changePassword(id: string, passwordData: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/change-password`, passwordData).pipe(
      catchError((err) => {
        console.error("Error changing password:", err)
        return of({ error: err.error?.message || "Error al cambiar contraseña" })
      }),
    )
  }

  /**
   * Resetear contraseña de usuario (solo admin)
   */
  resetUserPassword(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/reset-password`, {}).pipe(
      catchError((err) => {
        console.error("Error resetting password:", err)
        return of({ error: err.error?.message || "Error al resetear contraseña" })
      }),
    )
  }
}
