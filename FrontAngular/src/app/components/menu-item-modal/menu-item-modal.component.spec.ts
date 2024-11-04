import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemModalComponent } from './menu-item-modal.component';

describe('MenuItemModalComponent', () => {
  let component: MenuItemModalComponent;
  let fixture: ComponentFixture<MenuItemModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
