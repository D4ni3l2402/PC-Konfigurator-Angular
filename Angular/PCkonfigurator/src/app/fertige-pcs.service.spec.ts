import { TestBed } from '@angular/core/testing';

import { FertigePCsService } from './fertige-pcs.service';

describe('FertigePCsService', () => {
  let service: FertigePCsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FertigePCsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
