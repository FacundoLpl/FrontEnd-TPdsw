import { Injectable } from '@angular/core'
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { AuthService } from '../core/services/auth.service'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class ReviewServiceService {
  private baseUrl = 'http://localhost:3000/api/reviews'

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  getReviewsByProductId(productId: string): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      console.error('User not authenticated')
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      })
      return of({ error: 'Authentication required' })
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    })

    return this.http
      .get(`${this.baseUrl}/product/${productId}`, { headers })
      .pipe(catchError(this.handleError.bind(this)))
  }

  private handleError(error: any): Observable<any> {
    console.error('Error en el servicio de reviews:', error)
    return of([])
  }
  createReview(review: any): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      console.error('User not authenticated')
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      })
      return of({ error: 'Authentication required' })
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    })

    return this.http
      .post(this.baseUrl, review, { headers })
      .pipe(catchError(this.handleError.bind(this)))
  }
}
