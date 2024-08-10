import { TestBed } from '@angular/core/testing';

import { MiServPruebaService } from './mi-serv-prueba.service';

describe('MiServPruebaService', () => {
  let service: MiServPruebaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiServPruebaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
