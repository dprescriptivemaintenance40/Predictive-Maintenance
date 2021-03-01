import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptiveDisplayComponent } from './prescriptive-display.component';

describe('PrescriptiveDisplayComponent', () => {
  let component: PrescriptiveDisplayComponent;
  let fixture: ComponentFixture<PrescriptiveDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescriptiveDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptiveDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
