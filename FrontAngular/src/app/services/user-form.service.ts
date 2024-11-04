import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  dni: string;
  firstName: string;
  lastName: string;
  userType: string;}

@Injectable({
  providedIn: 'root'
})

export class UserFormService {
  readonly baseUrl = 'http://localhost:3000/api/users';
  
  constructor(private http: HttpClient) { }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getOneUser(id: string) {
    const url = this.baseUrl + 'users/' + id
    return this.http.get<any>(url)
  }
  postUser(user: any) {
    const url = this.baseUrl + 'users'
    return this.http.post<any>(url, user)
  }
  deleteUser(id: string) {
    const url = this.baseUrl + 'users/' + id
    return this.http.delete<any>(url)
  }
}

