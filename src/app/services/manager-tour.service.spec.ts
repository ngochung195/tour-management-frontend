import { TestBed } from '@angular/core/testing';

import { ManagerTourService } from './manager-tour.service';

describe('ManagerTourService', () => {
  let service: ManagerTourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerTourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
