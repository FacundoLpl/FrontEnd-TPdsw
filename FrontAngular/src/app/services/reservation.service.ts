import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  readonly baseUrl = 'http://localhost:3000/api/reservations/';

  constructor(private http: HttpClient) { }
  
  addReservation(user: string, people: number, datetime: string) {
    const reservation = {
      "user": user,
      "people": people,
      "datetime": datetime
    };
    this.http.post<any>(this.baseUrl, reservation).subscribe ({
      error: (err) => console.error("Error al agregar nueva reserva:", err) })
    }
  }