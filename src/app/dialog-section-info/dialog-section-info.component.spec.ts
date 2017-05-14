import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSectionInfoComponent } from './dialog-section-info.component';

describe('DialogSectionInfoComponent', () => {
  let component: DialogSectionInfoComponent;
  let fixture: ComponentFixture<DialogSectionInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSectionInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSectionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
