import { TestBed, inject } from '@angular/core/testing';

import { IntervenantService } from './intervenant.service';

describe('IntervenantService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IntervenantService]
    });
  });

  it('should be created', inject([IntervenantService], (service: IntervenantService) => {
    expect(service).toBeTruthy();
  }));
});
