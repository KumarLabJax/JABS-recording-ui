import { TestBed } from '@angular/core/testing';

import { RecordingSessionService } from './recording-session.service';

describe('RecordingSessionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecordingSessionService = TestBed.get(RecordingSessionService);
    expect(service).toBeTruthy();
  });
});
