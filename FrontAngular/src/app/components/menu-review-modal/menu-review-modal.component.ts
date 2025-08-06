import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReviewListComponent } from '../review/review-list/review-list.component';
import { ReviewServiceService } from '../../services/review-service.service'


@Component({
  selector: 'app-menu-review-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, ReviewListComponent],
  templateUrl: './menu-review-modal.component.html',
  styleUrl: './menu-review-modal.component.css'
})
export class MenuReviewModalComponent implements OnInit {
  @Input() productId = ""
  @Input() productName = ""
  @Input() imageUrl = ""

  @Output() close = new EventEmitter<void>()

  comment: string = ""
  rating: number = 0
  isSubmitting: boolean = false
  reviews: any[] = []
  averageRating: number = 0

  constructor(private reviewService: ReviewServiceService) {}

  ngOnInit(): void {
    if (this.productId) {
      this.loadReviews()
    }
  }

  onSubmitReview() {
    if (!this.comment || !this.rating) return

    this.isSubmitting = true

    // Acá deberías llamar al servicio que envía la review al backend
    console.log("Review enviada:", {
      rating: this.rating,
      comment: this.comment,
      product: this.productId,
    })

    setTimeout(() => {
      this.isSubmitting = false
      this.onClose()
    }, 1000)
  }

  onClose() {
    this.close.emit()
  }
  loadReviews() {
  this.reviewService.getReviewsByProductId(this.productId).subscribe((data: any[]) => {
    this.reviews = data
    this.calculateAverageRating()
  })
}

calculateAverageRating() {
  if (this.reviews.length === 0) {
    this.averageRating = 0
    return
  }

  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0)
  this.averageRating = parseFloat((total / this.reviews.length).toFixed(1)) // ej: 4.3
}

}

