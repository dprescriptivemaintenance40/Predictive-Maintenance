import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentrifugalPumpPredictionComponent } from './centrifugal-pump-prediction.component';

describe('CentrifugalPumpPredictionComponent', () => {
  let component: CentrifugalPumpPredictionComponent;
  let fixture: ComponentFixture<CentrifugalPumpPredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentrifugalPumpPredictionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CentrifugalPumpPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
