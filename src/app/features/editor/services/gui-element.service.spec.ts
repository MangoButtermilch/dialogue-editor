import { TestBed } from '@angular/core/testing';

import { GuiElementService } from './gui-element.service';

describe('GuiElementServiceService', () => {
  let service: GuiElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuiElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
