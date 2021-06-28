import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrewCompressorTraindataUploadComponent } from './screw-compressor-traindata-upload.component';

describe('ScrewCompressorTraindataUploadComponent', () => {
  let component: ScrewCompressorTraindataUploadComponent;
  let fixture: ComponentFixture<ScrewCompressorTraindataUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrewCompressorTraindataUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrewCompressorTraindataUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
