import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrewCompressorPredictiondataUploadComponent } from './screw-compressor-predictiondata-upload.component';

describe('ScrewCompressorPredictiondataUploadComponent', () => {
  let component: ScrewCompressorPredictiondataUploadComponent;
  let fixture: ComponentFixture<ScrewCompressorPredictiondataUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrewCompressorPredictiondataUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrewCompressorPredictiondataUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
