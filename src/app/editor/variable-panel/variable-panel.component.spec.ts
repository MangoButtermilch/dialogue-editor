import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablePanelComponent } from './variable-panel.component';

describe('VariablePanelComponent', () => {
  let component: VariablePanelComponent;
  let fixture: ComponentFixture<VariablePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariablePanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariablePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
