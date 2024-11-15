import { TestBed } from '@angular/core/testing';

import { EggsRecordsService } from './eggsRecord.service';

describe('EggsRecordsService', () => {
  let service: EggsRecordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EggsRecordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
