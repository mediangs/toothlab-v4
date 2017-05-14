import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogViewsettingComponent } from './dialog-viewsetting.component';

describe('DialogViewsettingComponent', () => {
  let component: DialogViewsettingComponent;
  let fixture: ComponentFixture<DialogViewsettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogViewsettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogViewsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
