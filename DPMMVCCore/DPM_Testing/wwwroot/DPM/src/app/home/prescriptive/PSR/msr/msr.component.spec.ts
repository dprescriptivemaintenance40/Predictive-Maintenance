import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MSRComponent } from './msr.component';

describe('MSRComponent', () => {
  let component: MSRComponent;
  let fixture: ComponentFixture<MSRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MSRComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MSRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
