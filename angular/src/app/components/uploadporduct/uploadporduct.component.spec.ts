import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadporductComponent } from './uploadporduct.component';

describe('UploadporductComponent', () => {
  let component: UploadporductComponent;
  let fixture: ComponentFixture<UploadporductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadporductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadporductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
