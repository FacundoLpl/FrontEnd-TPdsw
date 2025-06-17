import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService} from '../core/services/auth.service';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = 'http://localhost:3000/api/reservations';

  constructor(private http: HttpClient, private authService: AuthService) {}
  
 addReservation(user: string, people: number, datetime: string): Observable<any> {
  console.log('🚀 ReservationService received:', { user, people, datetime });
  console.log('🚀 Types in service:', {
    user: typeof user,
    people: typeof people,
    datetime: typeof datetime
  });

  const body = {
    state: 'Pending',
    user: user,
    people: people,
    datetime: datetime,
  };

  console.log('🚀 ReservationService sending body:', body);
  console.log('🚀 Body types:', {
    state: typeof body.state,
    user: typeof body.user,
    people: typeof body.people,
    datetime: typeof body.datetime
  });
  console.log('🚀 Datetime value:', body.datetime);

  return this.http.post(this.apiUrl, body);
}

  findAll(filter: any = {}) {
    let params = new HttpParams();
    if (filter.state) {
      params = params.set('state', filter.state);
    }
    if (filter.user) {
      params = params.set('user', filter.user);
    }
    return this.http.get(`${this.apiUrl}`, { params });
  }

  findOne() {
    const userId = this.authService.getId();
    if (userId != null) {
      let params = new HttpParams()
        .set('state', 'Pending') // ← Cambié 'pending' por 'Pending' (mayúscula)
        .set('user', userId);

      return this.http.get(`${this.apiUrl}`, { params });
    } else {
      return throwError(() => new Error("Log In antes de continuar"));
    }
  }

  // ✅ CORREGIDO: URL correcta
  cancelReservation(reservationId: string): Observable<any> {
  console.log('🔍 Service: Canceling reservation with ID:', reservationId);
  return this.http.delete(`${this.apiUrl}/${reservationId}`);
}
  // Obtener reserva pendiente del usuario
getPendingReservation(): Observable<any> {
  return this.http.get(`${this.apiUrl}/user/pending`);
}

// Obtener todas las reservas del usuario
getUserReservations(): Observable<any> {
  return this.http.get(`${this.apiUrl}/user/all`);
}


}