import { TestBed } from '@angular/core/testing';

import { MozoService } from './mozo.service';

describe('MozoService', () => {
  let service: MozoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MozoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
