import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRecordingSessionComponent } from './new-recording-session.component';

describe('NewRecordingSessionComponent', () => {
  let component: NewRecordingSessionComponent;
  let fixture: ComponentFixture<NewRecordingSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRecordingSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRecordingSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
