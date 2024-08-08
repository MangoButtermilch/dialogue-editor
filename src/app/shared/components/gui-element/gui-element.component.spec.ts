import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiElementComponent } from './gui-element.component';

describe('GuiElementComponent', () => {
  let component: GuiElementComponent;
  let fixture: ComponentFixture<GuiElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuiElementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuiElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
