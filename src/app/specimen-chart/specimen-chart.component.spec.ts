import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecimenChartComponent } from './specimen-chart.component';

describe('SpecimenChartComponent', () => {
  let component: SpecimenChartComponent;
  let fixture: ComponentFixture<SpecimenChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecimenChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecimenChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
