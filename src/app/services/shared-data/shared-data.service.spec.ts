import { TestBed } from '@angular/core/testing';

import { SharedDataService } from './shared-data.service';

describe('SharedDataService', () => {
  let service: SharedDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should generate a random number between 1 and 10', () => {
    service = new SharedDataService();
    expect(service.getRandomInt() >=1 && service.getRandomInt() <= 10).toBeTruthy();
  });

});
