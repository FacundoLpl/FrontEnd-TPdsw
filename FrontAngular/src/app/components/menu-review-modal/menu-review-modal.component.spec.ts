import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuReviewModalComponent } from './menu-review-modal.component';

describe('MenuReviewModalComponent', () => {
  let component: MenuReviewModalComponent;
  let fixture: ComponentFixture<MenuReviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuReviewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
