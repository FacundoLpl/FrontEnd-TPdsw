import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HijoPruebaComponent } from './hijo-prueba.component';

describe('HijoPruebaComponent', () => {
  let component: HijoPruebaComponent;
  let fixture: ComponentFixture<HijoPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HijoPruebaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HijoPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
