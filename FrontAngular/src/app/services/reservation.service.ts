import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService} from '../core/services/auth.service';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = 'http://localhost:3000/api/reservations'; // Cambia según la configuración de tu API

  constructor(private http: HttpClient, private authService: AuthService) {}

  addReservation(user: string, people: number, datetime: string): Observable<any> {
    const body = {
      state: 'Pending',
      user: user,
      people: people,
      datetime: datetime, // Enviar el valor directamente
    };

    return this.http.post(this.apiUrl, body); // ← Devolver Observable
  }
  findAll(filter: any = {}) {
      const token = this.authService.getToken();
      let params = new HttpParams();
      if (filter.state) {
        params = params.set('state', filter.state);
      }
      if (filter.user) {
        params = params.set('user', filter.user);
      }
      return this.http.get(`${this.apiUrl}`, { 
        params: params
      });
  }

  findOne() {
    const userId = this.authService.getId();
    if (userId != null) {
      let params = new HttpParams()
        .set('state', 'Pending')
        .set('user', userId);
      
        return this.http.get<{ message: string, data: any[] }>(`${this.apiUrl}`, { params }).pipe(
          map(response => response.data[0] || null) // devolvemos la primera reserva o null
        );
    } else {
      // Mejor mostrar el error fuera, y devolver un observable vacío
      return throwError(() => new Error("Log In antes de continuar"));
    }
  }
  
}
