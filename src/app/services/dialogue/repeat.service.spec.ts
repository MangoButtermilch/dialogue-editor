import { TestBed } from '@angular/core/testing';

import { RepeatService } from './repeat.service';

describe('RepeatService', () => {
  let service: RepeatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepeatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
