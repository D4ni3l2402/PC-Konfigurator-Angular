import { TestBed } from '@angular/core/testing';

import { ShoppingcartDataService } from './shoppingcart-data.service';

describe('ShoppingcartDataService', () => {
  let service: ShoppingcartDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingcartDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
