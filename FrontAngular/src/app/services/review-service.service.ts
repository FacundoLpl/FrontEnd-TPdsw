import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router'; 

@Injectable({
  providedIn: 'root',
})
export class ReviewServiceService {
  private baseUrl = 'http://localhost:3000/api/reviews';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
  ) {}


  getReviewsByProductId(productId: string): Observable<any> {

    console.log(`ReviewService: Fetching reviews for product ${productId} (public endpoint)`);
    return this.http
      .get(`${this.baseUrl}/product/${productId}`) 
      .pipe(catchError(this.handleError.bind(this)));
  }

  createReview(review: any): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      console.error('ReviewService: User not authenticated for creating review. Redirecting.');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return of({ error: 'Authentication required' });
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
    console.log('ReviewService: Creating review (private endpoint, adding token)');
    return this.http
      .post(this.baseUrl, review, { headers })
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateReview(id: string, reviewData: any): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      console.error('ReviewService: User not authenticated for updating review. Redirecting.');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return of({ error: 'Authentication required' });
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
    console.log(`ReviewService: Updating review ${id} (private endpoint, adding token)`);
    return this.http
      .put(`${this.baseUrl}/${id}`, reviewData, { headers })
      .pipe(catchError(this.handleError.bind(this)));
  }

  private handleError(error: any): Observable<any> {
    console.error('ReviewService: Error en la petición:', error);

    return of([]); 
  }
}
