import { TestBed } from '@angular/core/testing';

import { EventNodeService } from './event-node.service';

describe('EventNodeService', () => {
  let service: EventNodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventNodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
