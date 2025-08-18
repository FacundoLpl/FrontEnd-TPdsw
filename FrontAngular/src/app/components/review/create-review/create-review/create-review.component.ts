import { Component, Input } from '@angular/core';
import { ReviewServiceService } from '../../../../services/review-service.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-create-review',
  templateUrl: './create-review.component.html',
})
export class CreateReviewComponent {
  @Input() productId!: string;
  rating: number = 0;
  comment: string = '';
  submitted = false;

  constructor(
    private reviewService: ReviewServiceService,
    private authService: AuthService
  ) {}

  submitReview() {
    if (this.authService.isAuthenticated() && this.productId) {
      const review = {
        product: this.productId,
        rating: this.rating,
        comment: this.comment
      };
      alert('submit review');
      this.reviewService.createReview(review).subscribe({
        next: () => {
          this.submitted = true;
        },
        error: err => {
          console.error('Error al enviar reseña', err);
        }
      });
    }
  }
}
