import { TestBed } from '@angular/core/testing';

import { FlashcardTrackingService } from './flashcard-tracking.service';

describe('FlashcardTrackingService', () => {
  let service: FlashcardTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlashcardTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
