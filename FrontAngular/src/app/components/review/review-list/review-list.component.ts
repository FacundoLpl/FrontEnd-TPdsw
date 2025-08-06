import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core'
import { ReviewServiceService } from '../../../services/review-service.service'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ReviewListComponent implements OnInit, OnChanges {
  @Input() productId!: string
  reviews: any[] = []

  constructor(private reviewService: ReviewServiceService) {}

  ngOnInit() {
    // no hacemos nada acá porque el input puede llegar después
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productId'] && this.productId) {
      this.loadReviews()
    }
  }

  loadReviews() {
    this.reviewService.getReviewsByProductId(this.productId).subscribe(data => {
      this.reviews = data
    })
  }
}
