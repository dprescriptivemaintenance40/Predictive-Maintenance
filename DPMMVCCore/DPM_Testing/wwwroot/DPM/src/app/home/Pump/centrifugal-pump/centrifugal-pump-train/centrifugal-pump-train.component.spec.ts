import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentrifugalPumpTrainComponent } from './centrifugal-pump-train.component';

describe('CentrifugalPumpTrainComponent', () => {
  let component: CentrifugalPumpTrainComponent;
  let fixture: ComponentFixture<CentrifugalPumpTrainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentrifugalPumpTrainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CentrifugalPumpTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
