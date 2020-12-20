import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompressorDetailComponent } from './compressor-detail.component';

describe('CompressorDetailComponent', () => {
  let component: CompressorDetailComponent;
  let fixture: ComponentFixture<CompressorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompressorDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompressorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
