import { TestBed } from '@angular/core/testing';

import { DialogueService } from './dialogue.service';

describe('DialogueService', () => {
  let service: DialogueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
