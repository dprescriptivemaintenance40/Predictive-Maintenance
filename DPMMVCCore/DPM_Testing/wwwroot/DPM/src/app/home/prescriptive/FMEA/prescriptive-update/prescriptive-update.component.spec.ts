import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptiveUpdateComponent } from './prescriptive-update.component';

describe('PrescriptiveUpdateComponent', () => {
  let component: PrescriptiveUpdateComponent;
  let fixture: ComponentFixture<PrescriptiveUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescriptiveUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptiveUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
