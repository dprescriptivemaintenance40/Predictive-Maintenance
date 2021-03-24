import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptiveReportComponent } from './prescriptive-report.component';

describe('PrescriptiveReportComponent', () => {
  let component: PrescriptiveReportComponent;
  let fixture: ComponentFixture<PrescriptiveReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescriptiveReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptiveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
