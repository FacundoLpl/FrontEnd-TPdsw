import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})

export class MiServPruebaService {

  readonly baseUrl = 'http://localhost:3000/api/';
  
  constructor(private http: HttpClient) { }
  getUsers() {
    const url = this.baseUrl + 'users'
    return this.http.get<any>(url)
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