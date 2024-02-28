import { TestBed } from '@angular/core/testing';

import { GuiElementServiceService } from './gui-element-service.service';

describe('GuiElementServiceService', () => {
  let service: GuiElementServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuiElementServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
