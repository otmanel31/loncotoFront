import { TestBed, inject } from '@angular/core/testing';

import { InterventionsService } from './interventions.service';

describe('InterventionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InterventionsService]
    });
  });

  it('should be created', inject([InterventionsService], (service: InterventionsService) => {
    expect(service).toBeTruthy();
  }));
});
