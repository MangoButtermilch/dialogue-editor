import { TestBed } from '@angular/core/testing';

import { DomEventService } from './dom-event.service';

describe('DomEventService', () => {
  let service: DomEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DomEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
