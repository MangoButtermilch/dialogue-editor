import { TestBed } from '@angular/core/testing';

import { EditorStateService } from './editor-state.service';

describe('EditorStateService', () => {
  let service: EditorStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
