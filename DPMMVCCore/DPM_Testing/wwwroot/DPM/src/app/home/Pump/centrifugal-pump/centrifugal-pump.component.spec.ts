import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentrifugalPumpComponent } from './centrifugal-pump.component';

describe('CentrifugalPumpComponent', () => {
  let component: CentrifugalPumpComponent;
  let fixture: ComponentFixture<CentrifugalPumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentrifugalPumpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CentrifugalPumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
