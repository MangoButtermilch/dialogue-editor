import { TestBed } from '@angular/core/testing';

import { RandomNodeService } from './random-node.service';

describe('RandomNodeService', () => {
  let service: RandomNodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomNodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
