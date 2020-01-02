import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveStreamButtonComponent } from './live-stream-button.component';

describe('LiveStreamButtonComponent', () => {
  let component: LiveStreamButtonComponent;
  let fixture: ComponentFixture<LiveStreamButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveStreamButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveStreamButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
