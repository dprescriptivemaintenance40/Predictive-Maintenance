import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FCAADDComponent } from './fca-add.component';

describe('FCAADDComponent', () => {
  let component: FCAADDComponent;
  let fixture: ComponentFixture<FCAADDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FCAADDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FCAADDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
