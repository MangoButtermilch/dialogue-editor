import { TestBed } from '@angular/core/testing';

import { DialougeFactoryService } from './dialouge-factory.service';

describe('DialougeFactoryService', () => {
  let service: DialougeFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialougeFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
