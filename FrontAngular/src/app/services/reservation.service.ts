import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = 'http://localhost:3000/api/reservations'; // Cambia según la configuración de tu API

  constructor(private http: HttpClient) {}

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
}
