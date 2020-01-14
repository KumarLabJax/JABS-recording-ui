import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveStreamDialogComponent } from './live-stream-dialog.component';

describe('LiveStreamDialogComponent', () => {
  let component: LiveStreamDialogComponent;
  let fixture: ComponentFixture<LiveStreamDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveStreamDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveStreamDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
