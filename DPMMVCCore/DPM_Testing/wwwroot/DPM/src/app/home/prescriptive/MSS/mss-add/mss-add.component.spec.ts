import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MSSAddComponent } from './mss-add.component';

describe('MSSAddComponent', () => {
  let component: MSSAddComponent;
  let fixture: ComponentFixture<MSSAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MSSAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MSSAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
