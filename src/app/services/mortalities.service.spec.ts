import { TestBed } from '@angular/core/testing';

import { MortalitiesService } from './mortalities.service';

describe('MortalitiesService', () => {
  let service: MortalitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MortalitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
