import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginserviceService {

  constructor(private httpClient:HttpClient) { }
    token:string
    url = 'http://localhost:3000/api';
    login(user: any) {
      return this.httpClient.post(`${this.url}/login`, user);
    }
      
  }

