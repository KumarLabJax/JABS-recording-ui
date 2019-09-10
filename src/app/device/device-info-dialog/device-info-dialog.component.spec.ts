import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceInfoDialogComponent } from './device-info-dialog.component';

describe('DeviceInfoDialogComponent', () => {
  let component: DeviceInfoDialogComponent;
  let fixture: ComponentFixture<DeviceInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
