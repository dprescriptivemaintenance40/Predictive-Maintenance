import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptiveAddComponent } from './prescriptive-add.component';

describe('PrescriptiveAddComponent', () => {
  let component: PrescriptiveAddComponent;
  let fixture: ComponentFixture<PrescriptiveAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescriptiveAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptiveAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
