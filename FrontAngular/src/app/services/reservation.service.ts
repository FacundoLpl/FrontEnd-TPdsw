import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService} from '../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = 'http://localhost:3000/api/reservations'; // Cambia según la configuración de tu API

  constructor(private http: HttpClient, private authService: AuthService) {}

  addReservation(user: string, people: number, datetime: string): void {
    const body = {
      state: 'Pending',
      user: user,
      people: people,
      datetime: datetime, // Enviar el valor directamente
    };

    this.http.post(this.apiUrl, body).subscribe(
      (response) => {
        console.log('Reserva creada con éxito:', response);
      },
      (error) => {
        console.error('Error al crear la reserva:', error);
      }
    );
  }
  findAll(filter: any = {}) {
      // 1. Configurar headers con el token
      const token = this.authService.getToken();
    
  
      // 2. Configurar parámetros de consulta
      let params = new HttpParams();
      
      if (filter.state) {
        params = params.set('state', filter.state);
      }
      
      if (filter.user) {
        params = params.set('user', filter.user);
      }
  
      // 3. Realizar la petición con headers y params
      return this.http.get(`${this.apiUrl}`, { 
        params: params
      });
  }
}
