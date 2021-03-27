import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptiveListComponent } from './prescriptive-list.component';

describe('PrescriptiveListComponent', () => {
  let component: PrescriptiveListComponent;
  let fixture: ComponentFixture<PrescriptiveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescriptiveListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
