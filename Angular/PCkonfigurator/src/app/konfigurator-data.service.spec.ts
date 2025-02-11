import { TestBed } from '@angular/core/testing';

import { KonfiguratorDataService } from './konfigurator-data.service';

describe('KonfiguratorDataService', () => {
  let service: KonfiguratorDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KonfiguratorDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
