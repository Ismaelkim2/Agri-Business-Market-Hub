import { TestBed } from '@angular/core/testing';

import { SessionTimeoutService } from './session-timeout.service';

describe('SessionTimeoutService', () => {
  let service: SessionTimeoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionTimeoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
