import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentrifugalPumpPredictiondataUploadComponent } from './centrifugal-pump-predictiondata-upload.component';

describe('CentrifugalPumpPredictiondataUploadComponent', () => {
  let component: CentrifugalPumpPredictiondataUploadComponent;
  let fixture: ComponentFixture<CentrifugalPumpPredictiondataUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentrifugalPumpPredictiondataUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CentrifugalPumpPredictiondataUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
