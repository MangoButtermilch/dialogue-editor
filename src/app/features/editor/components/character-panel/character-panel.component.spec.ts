import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterPanelComponent } from './character-panel.component';

describe('CharacterPanelComponent', () => {
  let component: CharacterPanelComponent;
  let fixture: ComponentFixture<CharacterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharacterPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
