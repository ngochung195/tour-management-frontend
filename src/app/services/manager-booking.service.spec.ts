import { TestBed } from '@angular/core/testing';

import { ManagerBookingService } from './manager-booking.service';

describe('ManagerBookingService', () => {
  let service: ManagerBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerBookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
