import { TestBed } from '@angular/core/testing';

import { FarmdataService } from './farmdata.service';

describe('FarmdataService', () => {
  let service: FarmdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FarmdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
